<?php

namespace App\Http\Controllers;

use App\Models\IncomeCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeCategoryController extends Controller
{
    public function index()
    {
        $categories = IncomeCategory::orderBy('name')->get();

        return Inertia::render('income-categories/index', ['incomeCategories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        IncomeCategory::create($validated);

        return redirect()->route('income-categories.index')->with('success', 'Income category created successfully.');
    }

    public function update(Request $request, IncomeCategory $incomeCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $incomeCategory->update($validated);

        return redirect()->route('income-categories.index')->with('success', 'Income category updated successfully.');
    }

    public function destroy(IncomeCategory $incomeCategory)
    {
        $incomeCategory->delete();

        return redirect()->route('income-categories.index')->with('success', 'Income category deleted successfully.');
    }
}
