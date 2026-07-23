<?php

namespace App\Http\Controllers;

use App\Models\DiscountPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountPlanController extends Controller
{
    public function index()
    {
        $plans = DiscountPlan::latest()->paginate(20);

        return Inertia::render('settings/discount-plans', ['plans' => $plans]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        DiscountPlan::create($validated);

        return redirect()->route('settings.discount-plans.index')->with('success', 'Discount plan created.');
    }

    public function update(Request $request, DiscountPlan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $plan->update($validated);

        return redirect()->route('settings.discount-plans.index')->with('success', 'Discount plan updated.');
    }

    public function destroy(DiscountPlan $plan)
    {
        $plan->delete();

        return redirect()->route('settings.discount-plans.index')->with('success', 'Discount plan deleted.');
    }
}
