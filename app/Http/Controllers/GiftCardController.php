<?php

namespace App\Http\Controllers;

use App\Models\GiftCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GiftCardController extends Controller
{
    public function index(Request $request)
    {
        $giftCards = GiftCard::query()
            ->with(['customer', 'user'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('gift-cards/index', ['giftCards' => $giftCards]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:50|unique:gift_cards,code',
            'initial_amount' => 'required|numeric|min:1',
            'customer_id' => 'nullable|exists:customers,id',
            'expiry_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['code'])) {
            $validated['code'] = 'GC-'.strtoupper(Str::random(8));
        }

        GiftCard::create([
            ...$validated,
            'branch_id' => session('branch_id'),
            'current_balance' => $validated['initial_amount'],
            'user_id' => Auth::id(),
            'issued_date' => now()->toDateString(),
            'status' => 'active',
        ]);

        return redirect()->route('gift-cards.index')->with('success', 'Gift card created successfully.');
    }

    public function show(GiftCard $giftCard)
    {
        $giftCard->load(['customer', 'user', 'transactions.user']);

        return Inertia::render('gift-cards/show', ['giftCard' => $giftCard]);
    }

    public function update(Request $request, GiftCard $giftCard)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,cancelled',
        ]);

        $giftCard->update($validated);

        return redirect()->route('gift-cards.index')->with('success', 'Gift card updated.');
    }

    public function destroy(GiftCard $giftCard)
    {
        $giftCard->delete();

        return redirect()->route('gift-cards.index')->with('success', 'Gift card deleted.');
    }
}
