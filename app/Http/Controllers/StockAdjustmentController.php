<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockAdjustmentController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['category', 'unit'])
            ->search($request->search)
            ->when($request->stock_status === 'low', fn ($q) => $q->lowStock())
            ->when($request->stock_status === 'out', fn ($q) => $q->where('stock_quantity', '<=', 0))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('stock/index', [
            'products' => $products,
        ]);
    }

    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:addition,subtraction',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        $product = Product::find($validated['product_id']);

        if ($validated['type'] === 'subtraction' && $product->stock_quantity < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Cannot subtract more than available stock.']);
        }

        if ($validated['type'] === 'addition') {
            $product->increment('stock_quantity', $validated['quantity']);
        } else {
            $product->decrement('stock_quantity', $validated['quantity']);
        }

        return redirect()->route('stock.index')->with('success', 'Stock adjusted successfully.');
    }
}
