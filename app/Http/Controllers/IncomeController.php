<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\IncomeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $incomes = Income::query()
            ->with(['incomeCategory', 'user'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->when($request->category_id, fn ($q) => $q->where('income_category_id', $request->category_id))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $categories = IncomeCategory::orderBy('name')->get();

        return Inertia::render('incomes/index', [
            'incomes' => $incomes,
            'incomeCategories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'income_category_id' => 'required|exists:income_categories,id',
            'title' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'reference_no' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        Income::create([
            ...$validated,
            'branch_id' => session('branch_id'),
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('incomes.index')->with('success', 'Income created successfully.');
    }

    public function update(Request $request, Income $income)
    {
        $validated = $request->validate([
            'income_category_id' => 'required|exists:income_categories,id',
            'title' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'reference_no' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $income->update($validated);

        return redirect()->route('incomes.index')->with('success', 'Income updated successfully.');
    }

    public function destroy(Income $income)
    {
        $income->delete();

        return redirect()->route('incomes.index')->with('success', 'Income deleted successfully.');
    }
}
