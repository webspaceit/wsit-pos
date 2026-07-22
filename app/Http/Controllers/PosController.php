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

class PosController extends Controller
{
    public function index()
    {
        $products = Product::active()
            ->select('id', 'name', 'sku', 'barcode', 'selling_price', 'purchase_price', 'tax_rate', 'tax_type', 'stock_quantity')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'barcode' => $p->barcode,
                'price' => (float) $p->selling_price,
                'purchase_price' => (float) $p->purchase_price,
                'tax_rate' => (float) $p->tax_rate,
                'tax_type' => $p->tax_type,
                'stock' => (float) $p->stock_quantity,
            ]);

        $customers = Customer::active()
            ->select('id', 'name', 'phone', 'balance')
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/index', [
            'products' => $products,
            'customers' => $customers,
            'branchId' => session('branch_id'),
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'discount_type' => 'in:fixed,percent',
            'shipping_cost' => 'nullable|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
        ]);

        $branchId = session('branch_id');

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $taxAmount = 0;
            $lineItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    DB::rollBack();

                    return response()->json([
                        'error' => "Insufficient stock for {$product->name}. Available: {$product->stock_quantity}",
                    ], 422);
                }

                $itemDiscount = $item['discount'] ?? 0;
                $itemTotal = ($item['quantity'] * $item['price']) - $itemDiscount;
                $itemTax = $itemTotal * ($product->tax_rate / 100);

                $lineItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'discount' => $itemDiscount,
                    'tax_amount' => round($itemTax, 2),
                    'total' => round($itemTotal + $itemTax, 2),
                ];

                $subtotal += $lineItems[array_key_last($lineItems)]['total'];
                $taxAmount += $itemTax;
            }

            $discount = $validated['discount'] ?? 0;
            if (($validated['discount_type'] ?? 'fixed') === 'percent') {
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
                'date' => now()->toDateString(),
                'subtotal' => round($subtotal, 2),
                'discount' => round($discount, 2),
                'discount_type' => $validated['discount_type'] ?? 'fixed',
                'tax_amount' => round($taxAmount, 2),
                'shipping_cost' => $shippingCost,
                'grand_total' => round($grandTotal, 2),
                'paid_amount' => round($paidAmount, 2),
                'due_amount' => round($dueAmount, 2),
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
            ]);

            foreach ($lineItems as $li) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    ...$li,
                ]);

                Product::where('id', $li['product_id'])->decrement('stock_quantity', $li['quantity']);
            }

            if ($validated['customer_id'] && $dueAmount > 0) {
                Customer::where('id', $validated['customer_id'])->increment('balance', $dueAmount);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'sale_id' => $sale->id,
                'invoice_no' => $sale->invoice_no,
                'grand_total' => (float) $sale->grand_total,
                'paid_amount' => (float) $sale->paid_amount,
                'due_amount' => (float) $sale->due_amount,
                'change' => max(0, $paidAmount - $grandTotal),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function invoice(Sale $sale)
    {
        $sale->load(['items.product', 'customer', 'user', 'branch']);

        return Inertia::render('pos/invoice', [
            'sale' => $sale,
        ]);
    }
}
