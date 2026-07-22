<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $purchases = Purchase::query()
            ->with(['supplier', 'user'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->status($request->status)
            ->when($request->search, fn ($q, $s) => $q->where('reference_no', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $suppliers = Supplier::active()->orderBy('name')->get();

        return Inertia::render('purchases/index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
        ]);
    }

    public function create()
    {
        $suppliers = Supplier::active()->orderBy('name')->get();

        return Inertia::render('purchases/create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'nullable|exists:suppliers,id',
            'date' => 'required|date',
            'discount' => 'numeric|min:0',
            'shipping_cost' => 'numeric|min:0',
            'paid_amount' => 'numeric|min:0',
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
            $total = 0;
            $taxAmount = 0;

            foreach ($validated['items'] as &$item) {
                $itemTotal = ($item['quantity'] * $item['unit_price']) - ($item['discount'] ?? 0);
                $product = Product::find($item['product_id']);
                $itemTax = $itemTotal * ($product->tax_rate / 100);
                $item['tax_amount'] = round($itemTax, 2);
                $item['total'] = round($itemTotal + $itemTax, 2);
                $total += $item['total'];
                $taxAmount += $item['tax_amount'];
            }
            unset($item);

            $discount = $validated['discount'] ?? 0;
            $shippingCost = $validated['shipping_cost'] ?? 0;
            $grandTotal = $total - $discount + $shippingCost;
            $paidAmount = $validated['paid_amount'] ?? 0;
            $dueAmount = max(0, $grandTotal - $paidAmount);

            $purchase = Purchase::create([
                'branch_id' => $branchId,
                'supplier_id' => $validated['supplier_id'] ?? null,
                'user_id' => Auth::id(),
                'reference_no' => 'PUR-'.strtoupper(Str::random(8)),
                'date' => $validated['date'],
                'total' => $total,
                'discount' => $discount,
                'tax_amount' => round($taxAmount, 2),
                'shipping_cost' => $shippingCost,
                'grand_total' => round($grandTotal, 2),
                'paid_amount' => round($paidAmount, 2),
                'due_amount' => round($dueAmount, 2),
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'] ?? 0,
                    'tax_amount' => $item['tax_amount'],
                    'total' => $item['total'],
                ]);

                Product::where('id', $item['product_id'])->increment('stock_quantity', $item['quantity']);
            }

            if ($validated['supplier_id'] && $dueAmount > 0) {
                Supplier::where('id', $validated['supplier_id'])->increment('balance', $dueAmount);
            }

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['items.product', 'supplier', 'user', 'branch']);

        return Inertia::render('purchases/show', [
            'purchase' => $purchase,
        ]);
    }

    public function receive(Purchase $purchase)
    {
        if ($purchase->status !== 'pending') {
            return back()->with('error', 'Only pending purchases can be received.');
        }

        $purchase->update(['status' => 'received']);

        return redirect()->route('purchases.index')->with('success', 'Purchase received successfully.');
    }

    public function destroy(Purchase $purchase)
    {
        DB::beginTransaction();

        try {
            foreach ($purchase->items as $item) {
                Product::where('id', $item->product_id)->decrement('stock_quantity', $item->quantity);
            }

            if ($purchase->supplier_id && $purchase->due_amount > 0) {
                Supplier::where('id', $purchase->supplier_id)->decrement('balance', $purchase->due_amount);
            }

            $purchase->delete();

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
