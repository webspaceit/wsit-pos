<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::with(['product', 'items.product']);

        if ($request->search) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$request->search}%")));
        }

        return Inertia::render('manufacturing/recipes/index', [
            'recipes' => $query->latest()->paginate(20),
            'products' => fn () => Product::all(['id', 'name', 'unit_price']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'yield_quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        $recipe = Recipe::create([
            'name' => $validated['name'],
            'product_id' => $validated['product_id'],
            'yield_quantity' => $validated['yield_quantity'],
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            $recipe->items()->create($item);
        }

        return redirect()->route('manufacturing.recipes.index')->with('success', 'Recipe created.');
    }

    public function update(Request $request, Recipe $recipe)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'yield_quantity' => 'required|numeric|min:0.01',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        $recipe->update([
            'name' => $validated['name'],
            'product_id' => $validated['product_id'],
            'yield_quantity' => $validated['yield_quantity'],
            'is_active' => $validated['is_active'] ?? true,
            'notes' => $validated['notes'] ?? null,
        ]);

        $recipe->items()->delete();
        foreach ($validated['items'] as $item) {
            $recipe->items()->create($item);
        }

        return redirect()->route('manufacturing.recipes.index')->with('success', 'Recipe updated.');
    }

    public function destroy(Recipe $recipe)
    {
        $recipe->items()->delete();
        $recipe->delete();

        return redirect()->route('manufacturing.recipes.index')->with('success', 'Recipe deleted.');
    }
}
