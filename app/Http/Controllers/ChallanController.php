<?php

namespace App\Http\Controllers;

use App\Models\Challan;
use App\Models\ChallanItem;
use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChallanController extends Controller
{
    public function index(Request $request)
    {
        $challans = Challan::query()
            ->with(['customer', 'sale', 'user', 'items.product'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('challans/index', ['challans' => $challans]);
    }

    public function create(Request $request)
    {
        $sale = Sale::with(['items.product', 'customer'])->findOrFail($request->sale_id);
        $customers = Customer::orderBy('name')->get();

        return Inertia::render('challans/create', [
            'sale' => $sale,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'customer_id' => 'nullable|exists:customers,id',
            'date' => 'required|date',
            'delivery_address' => 'nullable|string',
            'driver_name' => 'nullable|string|max:100',
            'vehicle_no' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $sale = Sale::find($validated['sale_id']);

        DB::beginTransaction();
        try {
            $challan = Challan::create([
                ...$validated,
                'branch_id' => session('branch_id'),
                'user_id' => Auth::id(),
                'invoice_no' => $sale->invoice_no,
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                ChallanItem::create([
                    'challan_id' => $challan->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->route('challans.index')->with('success', 'Challan created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Challan $challan)
    {
        $challan->load(['customer', 'sale', 'user', 'items.product']);

        return Inertia::render('challans/show', ['challan' => $challan]);
    }

    public function update(Request $request, Challan $challan)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,dispatched,delivered,returned',
        ]);

        $challan->update($validated);

        return back()->with('success', 'Challan status updated.');
    }

    public function destroy(Challan $challan)
    {
        $challan->delete();

        return redirect()->route('challans.index')->with('success', 'Challan deleted.');
    }
}
