<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleReturnController extends Controller
{
    public function index(Request $request)
    {
        $returns = SaleReturn::query()
            ->with(['sale', 'customer', 'user', 'items.product'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('sale-returns/index', ['returns' => $returns]);
    }

    public function create(Request $request)
    {
        $sale = Sale::with(['items.product', 'customer'])
            ->where('id', $request->sale_id)
            ->firstOrFail();

        $products = Product::active()->orderBy('name')->get();

        return Inertia::render('sale-returns/create', [
            'sale' => $sale,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'customer_id' => 'nullable|exists:customers,id',
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

            $return = SaleReturn::create([
                'branch_id' => session('branch_id'),
                'sale_id' => $validated['sale_id'],
                'customer_id' => $validated['customer_id'] ?? null,
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

                SaleReturnItem::create([
                    'sale_return_id' => $return->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_amount' => $tax * $item['quantity'],
                    'total' => $item['unit_price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->route('sale-returns.index')->with('success', 'Sale return created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(SaleReturn $saleReturn)
    {
        $saleReturn->load(['sale', 'customer', 'user', 'items.product']);

        return Inertia::render('sale-returns/show', ['return' => $saleReturn]);
    }

    public function destroy(SaleReturn $saleReturn)
    {
        DB::beginTransaction();

        try {
            foreach ($saleReturn->items as $item) {
                Product::where('id', $item->product_id)->decrement('stock_quantity', $item->quantity);
            }

            $saleReturn->delete();
            DB::commit();

            return redirect()->route('sale-returns.index')->with('success', 'Sale return deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
