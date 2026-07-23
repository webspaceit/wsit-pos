<?php

namespace App\Http\Controllers;

use App\Models\DamageStock;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DamageStockController extends Controller
{
    public function index(Request $request)
    {
        $damages = DamageStock::query()
            ->with(['product', 'user'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $products = Product::active()->orderBy('name')->get();

        return Inertia::render('damage-stock/index', [
            'damages' => $damages,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        DamageStock::create([
            ...$validated,
            'branch_id' => session('branch_id'),
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('damage-stock.index')->with('success', 'Damage stock recorded successfully.');
    }

    public function destroy(DamageStock $damageStock)
    {
        Product::where('id', $damageStock->product_id)->increment('stock_quantity', $damageStock->quantity);
        $damageStock->delete();

        return redirect()->route('damage-stock.index')->with('success', 'Damage stock deleted successfully.');
    }
}
