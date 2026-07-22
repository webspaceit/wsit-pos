<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DueCollectionController extends Controller
{
    public function index(Request $request)
    {
        $sales = Sale::query()
            ->where('due_amount', '>', 0)
            ->where('status', 'completed')
            ->when(session('branch_id'), fn ($q) => $q->where('branch_id', session('branch_id')))
            ->when($request->customer_id, fn ($q) => $q->where('customer_id', $request->customer_id))
            ->when($request->search, fn ($q, $s) => $q->whereHas('customer', fn ($c) => $c->where('name', 'like', "%{$s}%")))
            ->with('customer')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $customers = Customer::where('balance', '>', 0)->orderBy('name')->get();
        $totalDue = Sale::where('due_amount', '>', 0)->where('status', 'completed')->sum('due_amount');

        return Inertia::render('due-collections/index', [
            'sales' => $sales,
            'customers' => $customers,
            'totalDue' => (float) $totalDue,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
        ]);

        $sale = Sale::findOrFail($validated['sale_id']);

        if ($validated['amount'] > $sale->due_amount) {
            return back()->withErrors(['amount' => 'Payment amount exceeds due amount.']);
        }

        DB::beginTransaction();

        try {
            $sale->increment('paid_amount', $validated['amount']);
            $sale->decrement('due_amount', $validated['amount']);

            if ($sale->customer_id) {
                Customer::where('id', $sale->customer_id)->decrement('balance', $validated['amount']);
            }

            DB::commit();

            return redirect()->route('due-collections.index')->with('success', 'Payment collected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
