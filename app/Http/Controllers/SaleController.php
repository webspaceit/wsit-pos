<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $sales = Sale::query()
            ->with(['customer', 'user'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->status($request->status)
            ->when($request->search, fn ($q, $s) => $q->where(function ($w) use ($s) {
                $w->where('reference_no', 'like', "%{$s}%")
                    ->orWhere('invoice_no', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('sales/index', [
            'sales' => $sales,
        ]);
    }

    public function create()
    {
        $customers = Customer::active()->orderBy('name')->get();

        return Inertia::render('sales/create', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'date' => 'required|date',
            'discount' => 'numeric|min:0',
            'discount_type' => 'in:fixed,percent',
            'shipping_cost' => 'numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'numeric|min:0',
        ]);

        $branchId = session('branch_id');

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $taxAmount = 0;

            foreach ($validated['items'] as &$item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    DB::rollBack();

                    return back()->withErrors(['items' => "Insufficient stock for {$product->name}. Available: {$product->stock_quantity}"]);
                }

                $itemTotal = ($item['quantity'] * $item['unit_price']) - ($item['discount'] ?? 0);
                $itemTax = $itemTotal * ($product->tax_rate / 100);
                $item['tax_amount'] = round($itemTax, 2);
                $item['total'] = round($itemTotal + $itemTax, 2);
                $subtotal += $item['total'];
                $taxAmount += $item['tax_amount'];
            }
            unset($item);

            $discount = $validated['discount'] ?? 0;
            if ($validated['discount_type'] === 'percent') {
                $discount = $subtotal * ($discount / 100);
            }

            $shippingCost = $validated['shipping_cost'] ?? 0;
            $grandTotal = $subtotal - $discount + $shippingCost;
            $paidAmount = $validated['paid_amount'];
            $dueAmount = max(0, $grandTotal - $paidAmount);

            $sale = Sale::create([
                'branch_id' => $branchId,
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => Auth::id(),
                'reference_no' => 'SL-'.strtoupper(Str::random(8)),
                'invoice_no' => 'INV-'.str_pad((string) (Sale::max('id') + 1), 6, '0', STR_PAD_LEFT),
                'date' => $validated['date'],
                'subtotal' => round($subtotal, 2),
                'discount' => round($discount, 2),
                'discount_type' => $validated['discount_type'],
                'tax_amount' => round($taxAmount, 2),
                'shipping_cost' => $shippingCost,
                'grand_total' => round($grandTotal, 2),
                'paid_amount' => round($paidAmount, 2),
                'due_amount' => round($dueAmount, 2),
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'] ?? 0,
                    'tax_amount' => $item['tax_amount'],
                    'total' => $item['total'],
                ]);

                Product::where('id', $item['product_id'])->decrement('stock_quantity', $item['quantity']);
            }

            if ($validated['customer_id'] && $dueAmount > 0) {
                Customer::where('id', $validated['customer_id'])->increment('balance', $dueAmount);
            }

            DB::commit();

            return redirect()->route('sales.show', $sale)->with('success', 'Sale completed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Sale $sale)
    {
        $sale->load(['items.product', 'customer', 'user', 'branch']);

        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }

    public function voidSale(Sale $sale)
    {
        if ($sale->status !== 'completed') {
            return back()->with('error', 'Only completed sales can be voided.');
        }

        DB::beginTransaction();

        try {
            foreach ($sale->items as $item) {
                Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
            }

            if ($sale->customer_id && $sale->due_amount > 0) {
                Customer::where('id', $sale->customer_id)->decrement('balance', $sale->due_amount);
            }

            $sale->update(['status' => 'void']);

            DB::commit();

            return redirect()->route('sales.index')->with('success', 'Sale voided successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(Sale $sale)
    {
        DB::beginTransaction();

        try {
            foreach ($sale->items as $item) {
                Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
            }

            if ($sale->customer_id && $sale->due_amount > 0) {
                Customer::where('id', $sale->customer_id)->decrement('balance', $sale->due_amount);
            }

            $sale->delete();

            DB::commit();

            return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
