<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $accounts = Account::query()
            ->with(['parent', 'children'])
            ->when($request->type, fn ($q) => $q->where('type', $request->type))
            ->orderBy('account_code')
            ->get();

        $grouped = $accounts->groupBy('type');

        return Inertia::render('accounting/chart-of-accounts', [
            'accounts' => $grouped,
            'allAccounts' => $accounts,
            'filter' => $request->only('type'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_code' => 'required|string|max:20|unique:accounts,account_code',
            'name' => 'required|string|max:100',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
            'sub_type' => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:accounts,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Account::create($validated);

        return redirect()->route('accounts.index')->with('success', 'Account created.');
    }

    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'sub_type' => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:accounts,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $account->update($validated);

        return redirect()->route('accounts.index')->with('success', 'Account updated.');
    }

    public function destroy(Account $account)
    {
        if ($account->journalLines()->exists()) {
            return back()->withErrors(['account' => 'Cannot delete account with journal entries.']);
        }

        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Account deleted.');
    }
}
