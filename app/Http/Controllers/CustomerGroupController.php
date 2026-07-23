<?php

namespace App\Http\Controllers;

use App\Models\CustomerGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerGroupController extends Controller
{
    public function index()
    {
        $groups = CustomerGroup::withCount('customers')->latest()->paginate(20);

        return Inertia::render('settings/customer-groups', ['groups' => $groups]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:customer_groups,name',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        CustomerGroup::create($validated);

        return redirect()->route('settings.customer-groups.index')->with('success', 'Customer group created.');
    }

    public function update(Request $request, CustomerGroup $group)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:customer_groups,name,'.$group->id,
            'discount_percent' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $group->update($validated);

        return redirect()->route('settings.customer-groups.index')->with('success', 'Customer group updated.');
    }

    public function destroy(CustomerGroup $group)
    {
        if ($group->customers()->exists()) {
            return back()->withErrors(['group' => 'Cannot delete group with assigned customers.']);
        }

        $group->delete();

        return redirect()->route('settings.customer-groups.index')->with('success', 'Customer group deleted.');
    }
}
