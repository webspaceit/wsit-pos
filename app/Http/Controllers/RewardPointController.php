<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\RewardPoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RewardPointController extends Controller
{
    public function index(Request $request)
    {
        $points = RewardPoint::query()
            ->with(['customer', 'sale'])
            ->when($request->customer_id, fn ($q) => $q->where('customer_id', $request->customer_id))
            ->latest()
            ->paginate(50)
            ->withQueryString();

        $customers = Customer::active()->orderBy('name')->get(['id', 'name', 'reward_points']);

        return Inertia::render('settings/reward-points', [
            'points' => $points,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'points' => 'required|integer',
            'type' => 'required|in:earned,redeemed,adjusted',
            'description' => 'nullable|string',
        ]);

        RewardPoint::create($validated);

        $customer = Customer::find($validated['customer_id']);
        $modifier = $validated['type'] === 'redeemed' ? -abs($validated['points']) : abs($validated['points']);
        $customer->increment('reward_points', $modifier);

        return redirect()->route('settings.reward-points.index')->with('success', 'Reward points recorded.');
    }

    public function destroy(RewardPoint $point)
    {
        $customer = $point->customer;
        $modifier = $point->type === 'redeemed' ? abs($point->points) : -$point->points;
        $customer->increment('reward_points', $modifier);
        $point->delete();

        return redirect()->route('settings.reward-points.index')->with('success', 'Reward point entry deleted.');
    }
}
