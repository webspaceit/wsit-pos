<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = Expense::query()
            ->with(['expenseCategory', 'user'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->when($request->category_id, fn ($q) => $q->where('expense_category_id', $request->category_id))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $categories = ExpenseCategory::orderBy('name')->get();

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'expenseCategories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'title' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'reference_no' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        Expense::create([
            ...$validated,
            'branch_id' => session('branch_id'),
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('expenses.index')->with('success', 'Expense created successfully.');
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'title' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'reference_no' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
    }
}
