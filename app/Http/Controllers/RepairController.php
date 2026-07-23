<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\RepairTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepairController extends Controller
{
    public function index(Request $request)
    {
        $query = RepairTicket::with(['branch', 'customer', 'user']);

        if ($request->search) {
            $query->where(fn ($q) => $q->where('ticket_no', 'like', "%{$request->search}%")
                ->orWhere('device_type', 'like', "%{$request->search}%")
                ->orWhere('device_model', 'like', "%{$request->search}%"));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('repairs/index', [
            'tickets' => $query->latest()->paginate(20),
            'customers' => fn () => Customer::all(['id', 'name', 'phone']),
            'branches' => fn () => Branch::all(['id', 'name']),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'branch_id' => 'required|exists:branches,id',
            'date' => 'required|date',
            'device_type' => 'required|string|max:100',
            'device_brand' => 'nullable|string|max:100',
            'device_model' => 'nullable|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'issue_description' => 'required|string',
            'estimated_cost' => 'nullable|numeric|min:0',
            'advance_paid' => 'nullable|numeric|min:0',
            'estimated_delivery' => 'nullable|date',
            'internal_notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        RepairTicket::create($validated);

        return redirect()->route('repairs.index')->with('success', 'Repair ticket created.');
    }

    public function show(RepairTicket $ticket)
    {
        $ticket->load(['branch', 'customer', 'user']);

        return Inertia::render('repairs/show', ['ticket' => $ticket]);
    }

    public function update(Request $request, RepairTicket $ticket)
    {
        $validated = $request->validate([
            'device_type' => 'sometimes|string|max:100',
            'device_brand' => 'nullable|string|max:100',
            'device_model' => 'nullable|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'issue_description' => 'sometimes|string',
            'estimated_cost' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'advance_paid' => 'nullable|numeric|min:0',
            'status' => 'required|in:received,diagnosed,in_repair,ready,delivered,cancelled',
            'estimated_delivery' => 'nullable|date',
            'actual_delivery' => 'nullable|date',
            'technician_notes' => 'nullable|string',
            'internal_notes' => 'nullable|string',
        ]);

        $ticket->update($validated);

        return back()->with('success', 'Repair ticket updated.');
    }

    public function destroy(RepairTicket $ticket)
    {
        $ticket->delete();

        return redirect()->route('repairs.index')->with('success', 'Repair ticket deleted.');
    }
}
