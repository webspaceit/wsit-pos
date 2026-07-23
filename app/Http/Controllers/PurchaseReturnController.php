<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseReturnController extends Controller
{
    public function index(Request $request)
    {
        $returns = PurchaseReturn::query()
            ->with(['purchase', 'supplier', 'user', 'items.product'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('purchase-returns/index', ['returns' => $returns]);
    }

    public function create(Request $request)
    {
        $purchase = Purchase::with(['items.product', 'supplier'])
            ->where('id', $request->purchase_id)
            ->firstOrFail();

        $products = Product::active()->orderBy('name')->get();

        return Inertia::render('purchase-returns/create', [
            'purchase' => $purchase,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_id' => 'required|exists:purchases,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $taxAmount = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $tax = $product->tax_type === 'inclusive'
                    ? $item['unit_price'] - ($item['unit_price'] / (1 + $product->tax_rate / 100))
                    : $item['unit_price'] * $product->tax_rate / 100;
                $itemTotal = $item['unit_price'] * $item['quantity'];
                $subtotal += $itemTotal;
                $taxAmount += $tax * $item['quantity'];
            }

            $return = PurchaseReturn::create([
                'branch_id' => session('branch_id'),
                'purchase_id' => $validated['purchase_id'],
                'supplier_id' => $validated['supplier_id'] ?? null,
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'grand_total' => $subtotal + $taxAmount,
                'payment_method' => $validated['payment_method'],
                'reason' => $validated['reason'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $tax = $product->tax_type === 'inclusive'
                    ? $item['unit_price'] - ($item['unit_price'] / (1 + $product->tax_rate / 100))
                    : $item['unit_price'] * $product->tax_rate / 100;

                PurchaseReturnItem::create([
                    'purchase_return_id' => $return->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_amount' => $tax * $item['quantity'],
                    'total' => $item['unit_price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->route('purchase-returns.index')->with('success', 'Purchase return created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(PurchaseReturn $purchaseReturn)
    {
        $purchaseReturn->load(['purchase', 'supplier', 'user', 'items.product']);

        return Inertia::render('purchase-returns/show', ['return' => $purchaseReturn]);
    }

    public function destroy(PurchaseReturn $purchaseReturn)
    {
        DB::beginTransaction();

        try {
            foreach ($purchaseReturn->items as $item) {
                Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
            }

            $purchaseReturn->delete();
            DB::commit();

            return redirect()->route('purchase-returns.index')->with('success', 'Purchase return deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
