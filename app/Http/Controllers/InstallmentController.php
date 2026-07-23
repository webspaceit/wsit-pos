<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\InstallmentPayment;
use App\Models\InstallmentPlan;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        $plans = InstallmentPlan::query()
            ->with(['customer', 'sale', 'user'])
            ->byBranch(session('branch_id'))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('installments/index', ['plans' => $plans]);
    }

    public function create(Request $request)
    {
        $sale = Sale::with(['customer', 'items.product'])->findOrFail($request->sale_id);
        $customers = Customer::orderBy('name')->get();

        return Inertia::render('installments/create', [
            'sale' => $sale,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'customer_id' => 'required|exists:customers,id',
            'total_amount' => 'required|numeric|min:1',
            'down_payment' => 'numeric|min:0',
            'installment_amount' => 'required|numeric|min:1',
            'total_installments' => 'required|integer|min:1',
            'interest_rate' => 'numeric|min:0|max:100',
            'penalty_rate' => 'numeric|min:0|max:100',
            'start_date' => 'required|date',
            'frequency' => 'required|in:weekly,biweekly,monthly',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $plan = InstallmentPlan::create([
                ...$validated,
                'branch_id' => session('branch_id'),
                'user_id' => Auth::id(),
                'paid_installments' => 0,
                'status' => 'active',
            ]);

            $remaining = $validated['total_amount'] - ($validated['down_payment'] ?? 0);
            $dueDate = Carbon::parse($validated['start_date']);

            for ($i = 1; $i <= $validated['total_installments']; $i++) {
                $remaining -= $validated['installment_amount'];
                InstallmentPayment::create([
                    'installment_plan_id' => $plan->id,
                    'user_id' => Auth::id(),
                    'installment_number' => $i,
                    'amount' => $validated['installment_amount'],
                    'running_balance' => max(0, $remaining),
                    'due_date' => $dueDate->copy(),
                    'status' => 'pending',
                ]);

                match ($validated['frequency']) {
                    'weekly' => $dueDate->addWeek(),
                    'biweekly' => $dueDate->addWeeks(2),
                    'monthly' => $dueDate->addMonth(),
                };
            }

            DB::commit();

            return redirect()->route('installments.index')->with('success', 'Installment plan created.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(InstallmentPlan $installment)
    {
        $installment->load(['customer', 'sale', 'user', 'payments.user']);

        return Inertia::render('installments/show', ['plan' => $installment]);
    }

    public function pay(Request $request, InstallmentPayment $payment)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
        ]);

        DB::beginTransaction();
        try {
            $payment->update([
                'status' => 'paid',
                'paid_date' => now()->toDateString(),
                'payment_method' => $validated['payment_method'],
            ]);

            $plan = $payment->installmentPlan;
            $plan->increment('paid_installments');

            if ($plan->paid_installments >= $plan->total_installments) {
                $plan->update(['status' => 'completed']);
            }

            DB::commit();

            return back()->with('success', 'Payment recorded successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(InstallmentPlan $installment)
    {
        $installment->delete();

        return redirect()->route('installments.index')->with('success', 'Installment plan deleted.');
    }
}
