<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountingController extends Controller
{
    public function trialBalance(Request $request)
    {
        $asOf = $request->date ?? now()->format('Y-m-d');

        $accounts = Account::active()
            ->orderBy('account_code')
            ->get()
            ->map(function ($account) use ($asOf) {
                $lines = JournalEntryLine::where('account_id', $account->id)
                    ->whereHas('journalEntry', function ($q) use ($asOf) {
                        $q->where('is_posted', true)->where('date', '<=', $asOf);
                    });

                $debit = (float) $lines->sum('debit');
                $credit = (float) $lines->sum('credit');
                $balance = match ($account->type) {
                    'asset', 'expense' => $debit - $credit,
                    default => $credit - $debit,
                };

                return [
                    'id' => $account->id,
                    'account_code' => $account->account_code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'debit' => $debit,
                    'credit' => $credit,
                    'balance' => $balance,
                ];
            })
            ->filter(fn ($a) => $a['debit'] > 0 || $a['credit'] > 0 || $a['balance'] != 0);

        $totalDebit = $accounts->sum('debit');
        $totalCredit = $accounts->sum('credit');

        return Inertia::render('accounting/trial-balance', [
            'accounts' => $accounts->values(),
            'totalDebit' => $totalDebit,
            'totalCredit' => $totalCredit,
            'asOf' => $asOf,
        ]);
    }

    public function generalLedger(Request $request)
    {
        $request->validate([
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        $entries = JournalEntry::query()
            ->with(['lines.account', 'user'])
            ->where('is_posted', true)
            ->when($request->from, fn ($q) => $q->where('date', '>=', $request->from))
            ->when($request->to, fn ($q) => $q->where('date', '<=', $request->to))
            ->when($request->account_id, function ($q) use ($request) {
                $q->whereHas('lines', fn ($lq) => $lq->where('account_id', $request->account_id));
            })
            ->orderBy('date')
            ->orderBy('reference_no')
            ->paginate(50)
            ->withQueryString();

        $accounts = Account::active()->orderBy('account_code')->get();

        return Inertia::render('accounting/general-ledger', [
            'entries' => $entries,
            'accounts' => $accounts,
            'filters' => $request->only(['from', 'to', 'account_id']),
        ]);
    }

    public function balanceSheet(Request $request)
    {
        $asOf = $request->date ?? now()->format('Y-m-d');

        $accountData = Account::active()->orderBy('account_code')->get()->map(function ($account) use ($asOf) {
            $lines = JournalEntryLine::where('account_id', $account->id)
                ->whereHas('journalEntry', function ($q) use ($asOf) {
                    $q->where('is_posted', true)->where('date', '<=', $asOf);
                });

            $debit = (float) $lines->sum('debit');
            $credit = (float) $lines->sum('credit');
            $balance = match ($account->type) {
                'asset', 'expense' => $debit - $credit,
                default => $credit - $debit,
            };

            return [
                'account_code' => $account->account_code,
                'name' => $account->name,
                'type' => $account->type,
                'balance' => $balance,
            ];
        });

        $assets = $accountData->where('type', 'asset')->filter(fn ($a) => $a['balance'] != 0)->values();
        $liabilities = $accountData->where('type', 'liability')->filter(fn ($a) => $a['balance'] != 0)->values();
        $equity = $accountData->where('type', 'equity')->filter(fn ($a) => $a['balance'] != 0)->values();
        $revenue = $accountData->where('type', 'revenue')->filter(fn ($a) => $a['balance'] != 0)->values();
        $expenses = $accountData->where('type', 'expense')->filter(fn ($a) => $a['balance'] != 0)->values();

        $totalAssets = $assets->sum('balance');
        $totalLiabilities = $liabilities->sum('balance');
        $totalEquity = $equity->sum('balance');
        $totalRevenue = $revenue->sum('balance');
        $totalExpenses = $expenses->sum('balance');
        $netIncome = $totalRevenue - $totalExpenses;

        return Inertia::render('accounting/balance-sheet', [
            'assets' => $assets,
            'liabilities' => $liabilities,
            'equity' => $equity,
            'revenue' => $revenue,
            'expenses' => $expenses,
            'totalAssets' => $totalAssets,
            'totalLiabilities' => $totalLiabilities,
            'totalEquity' => $totalEquity,
            'netIncome' => $netIncome,
            'asOf' => $asOf,
        ]);
    }

    public function cashFlow(Request $request)
    {
        $from = $request->from ?? now()->startOfYear()->format('Y-m-d');
        $to = $request->to ?? now()->format('Y-m-d');

        $entries = JournalEntry::query()
            ->with(['lines.account'])
            ->where('is_posted', true)
            ->whereBetween('date', [$from, $to])
            ->orderBy('date')
            ->get();

        $operatingIn = 0;
        $operatingOut = 0;
        $investingIn = 0;
        $investingOut = 0;
        $financingIn = 0;
        $financingOut = 0;

        foreach ($entries as $entry) {
            foreach ($entry->lines as $line) {
                $account = $line->account;
                $amount = (float) $line->debit - (float) $line->credit;
                $absAmount = abs($amount);

                if (in_array($account->sub_type ?? '', ['cash', 'bank', 'cash_at_hand', 'bank_account'])) {
                    if ($amount > 0) {
                        $operatingIn += $absAmount;
                    } else {
                        $operatingOut += $absAmount;
                    }
                } elseif ($account->type === 'asset' && ! in_array($account->sub_type ?? '', ['cash', 'bank', 'cash_at_hand', 'bank_account'])) {
                    if ($amount > 0) {
                        $investingOut += $absAmount;
                    } else {
                        $investingIn += $absAmount;
                    }
                } elseif ($account->type === 'liability') {
                    if ($amount > 0) {
                        $financingIn += $absAmount;
                    } else {
                        $financingOut += $absAmount;
                    }
                } elseif ($account->type === 'revenue') {
                    $operatingIn += $absAmount;
                } elseif ($account->type === 'expense') {
                    $operatingOut += $absAmount;
                }
            }
        }

        return Inertia::render('accounting/cash-flow', [
            'operatingIn' => $operatingIn,
            'operatingOut' => $operatingOut,
            'investingIn' => $investingIn,
            'investingOut' => $investingOut,
            'financingIn' => $financingIn,
            'financingOut' => $financingOut,
            'from' => $from,
            'to' => $to,
        ]);
    }
}
