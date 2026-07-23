<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Product;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockTransferController extends Controller
{
    public function index(Request $request)
    {
        $transfers = StockTransfer::query()
            ->with(['fromBranch', 'toBranch', 'user', 'items.product'])
            ->byDateRange($request->from, $request->to)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get();

        return Inertia::render('stock-transfers/index', [
            'transfers' => $transfers,
            'branches' => $branches,
        ]);
    }

    public function create()
    {
        $branches = Branch::orderBy('name')->get();
        $products = Product::active()->orderBy('name')->get();

        return Inertia::render('stock-transfers/create', [
            'branches' => $branches,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_branch_id' => 'required|exists:branches,id',
            'to_branch_id' => 'required|exists:branches,id|not_in:'.$request->from_branch_id,
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        DB::beginTransaction();

        try {
            $transfer = StockTransfer::create([
                'from_branch_id' => $validated['from_branch_id'],
                'to_branch_id' => $validated['to_branch_id'],
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(StockTransfer $stockTransfer)
    {
        $stockTransfer->load(['fromBranch', 'toBranch', 'user', 'items.product']);

        return Inertia::render('stock-transfers/show', ['transfer' => $stockTransfer]);
    }

    public function receive(StockTransfer $stockTransfer)
    {
        if ($stockTransfer->status !== 'pending') {
            return back()->withErrors(['status' => 'Transfer cannot be received.']);
        }

        DB::beginTransaction();

        try {
            foreach ($stockTransfer->items as $item) {
                Product::where('id', $item->product_id)->decrement('stock_quantity', $item->quantity);
            }

            $stockTransfer->update(['status' => 'received']);
            DB::commit();

            return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer received successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(StockTransfer $stockTransfer)
    {
        if ($stockTransfer->status !== 'pending') {
            return back()->withErrors(['status' => 'Cannot delete a non-pending transfer.']);
        }

        $stockTransfer->delete();

        return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer deleted successfully.');
    }
}
