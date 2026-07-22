<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['category', 'unit'])
            ->search($request->search)
            ->when($request->category_id, fn ($q) => $q->where('category_id', $request->category_id))
            ->when($request->stock_status === 'low', fn ($q) => $q->lowStock())
            ->when($request->stock_status === 'out', fn ($q) => $q->where('stock_quantity', '<=', 0))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $units = Unit::orderBy('name')->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $units = Unit::orderBy('name')->get();

        return Inertia::render('products/create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'sku' => 'nullable|string|max:50|unique:products,sku',
            'barcode' => 'nullable|string|max:50|unique:products,barcode',
            'category_id' => 'nullable|exists:categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'tax_rate' => 'numeric|min:0|max:100',
            'tax_type' => 'in:inclusive,exclusive',
            'stock_quantity' => 'numeric|min:0',
            'min_stock' => 'numeric|min:0',
            'max_stock' => 'numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $units = Unit::orderBy('name')->get();

        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'sku' => 'nullable|string|max:50|unique:products,sku,'.$product->id,
            'barcode' => 'nullable|string|max:50|unique:products,barcode,'.$product->id,
            'category_id' => 'nullable|exists:categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'tax_rate' => 'numeric|min:0|max:100',
            'tax_type' => 'in:inclusive,exclusive',
            'stock_quantity' => 'numeric|min:0',
            'min_stock' => 'numeric|min:0',
            'max_stock' => 'numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    public function search(Request $request)
    {
        $products = Product::active()
            ->search($request->input('search'))
            ->limit(20)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'barcode' => $p->barcode,
                'selling_price' => (float) $p->selling_price,
                'purchase_price' => (float) $p->purchase_price,
                'tax_rate' => (float) $p->tax_rate,
                'tax_type' => $p->tax_type,
                'stock_quantity' => (float) $p->stock_quantity,
                'unit' => $p->unit?->short_name,
            ]);

        return response()->json($products);
    }
}
