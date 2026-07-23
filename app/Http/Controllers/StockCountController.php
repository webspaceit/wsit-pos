<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockCount;
use App\Models\StockCountItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockCountController extends Controller
{
    public function index(Request $request)
    {
        $counts = StockCount::query()
            ->with(['user', 'items.product'])
            ->byBranch(session('branch_id'))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('stock-counts/index', ['counts' => $counts]);
    }

    public function create()
    {
        $products = Product::active()->orderBy('name')->get();

        return Inertia::render('stock-counts/create', ['products' => $products]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.counted_quantity' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $count = StockCount::create([
                'branch_id' => session('branch_id'),
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $systemQty = $product->stock_quantity;

                StockCountItem::create([
                    'stock_count_id' => $count->id,
                    'product_id' => $item['product_id'],
                    'system_quantity' => $systemQty,
                    'counted_quantity' => $item['counted_quantity'],
                    'difference' => $item['counted_quantity'] - $systemQty,
                ]);

                $product->update(['stock_quantity' => $item['counted_quantity']]);
            }

            DB::commit();

            return redirect()->route('stock-counts.index')->with('success', 'Stock count completed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(StockCount $stockCount)
    {
        $stockCount->load(['user', 'items.product']);

        return Inertia::render('stock-counts/show', ['count' => $stockCount]);
    }

    public function destroy(StockCount $stockCount)
    {
        if ($stockCount->status !== 'draft') {
            return back()->withErrors(['status' => 'Cannot delete a completed stock count.']);
        }

        $stockCount->delete();

        return redirect()->route('stock-counts.index')->with('success', 'Stock count deleted successfully.');
    }
}
