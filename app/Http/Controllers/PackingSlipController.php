<?php

namespace App\Http\Controllers;

use App\Models\PackingSlip;
use App\Models\PackingSlipItem;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PackingSlipController extends Controller
{
    public function index(Request $request)
    {
        $slips = PackingSlip::query()
            ->with(['sale', 'user', 'items.product'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('packing-slips/index', ['packingSlips' => $slips]);
    }

    public function create(Request $request)
    {
        $sale = Sale::with(['items.product', 'customer'])->findOrFail($request->sale_id);

        return Inertia::render('packing-slips/create', ['sale' => $sale]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        DB::beginTransaction();
        try {
            $slip = PackingSlip::create([
                'branch_id' => session('branch_id'),
                'sale_id' => $validated['sale_id'],
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                PackingSlipItem::create([
                    'packing_slip_id' => $slip->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->route('packing-slips.index')->with('success', 'Packing slip created.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(PackingSlip $packingSlip)
    {
        $packingSlip->load(['sale', 'user', 'items.product']);

        return Inertia::render('packing-slips/show', ['packingSlip' => $packingSlip]);
    }

    public function update(Request $request, PackingSlip $packingSlip)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,packed,shipped,delivered',
        ]);

        $packingSlip->update($validated);

        return back()->with('success', 'Status updated.');
    }

    public function destroy(PackingSlip $packingSlip)
    {
        $packingSlip->delete();

        return redirect()->route('packing-slips.index')->with('success', 'Packing slip deleted.');
    }
}
