<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\ProductionOrder;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductionOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductionOrder::with(['recipe', 'branch', 'user']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->where('reference_no', 'like', "%{$request->search}%");
        }

        return Inertia::render('manufacturing/orders/index', [
            'orders' => $query->latest()->paginate(20),
            'recipes' => fn () => Recipe::with('product')->get(),
            'branches' => fn () => Branch::all(['id', 'name']),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'branch_id' => 'required|exists:branches,id',
            'date' => 'required|date',
            'quantity_to_produce' => 'required|numeric|min:1',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['reference_no'] = 'PO-'.strtoupper(Str::random(8));

        $recipe = Recipe::with('items')->find($validated['recipe_id']);
        $validated['total_cost'] = $recipe->items->sum(fn ($item) => $item->quantity * $item->unit_cost) * ($validated['quantity_to_produce'] / $recipe->yield_quantity);

        ProductionOrder::create($validated);

        return redirect()->route('manufacturing.orders.index')->with('success', 'Production order created.');
    }

    public function updateStatus(Request $request, ProductionOrder $order)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'quantity_produced' => 'nullable|numeric|min:0',
        ]);

        $update = ['status' => $request->status];
        if ($request->quantity_produced) {
            $update['quantity_produced'] = $request->quantity_produced;
        }

        $order->update($update);

        return back()->with('success', 'Order status updated.');
    }

    public function destroy(ProductionOrder $order)
    {
        $order->delete();

        return redirect()->route('manufacturing.orders.index')->with('success', 'Order deleted.');
    }
}
