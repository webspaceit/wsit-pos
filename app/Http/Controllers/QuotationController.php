<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $quotations = Quotation::query()
            ->with(['customer', 'user', 'items.product'])
            ->byBranch(session('branch_id'))
            ->byDateRange($request->from, $request->to)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('quotations/index', ['quotations' => $quotations]);
    }

    public function create()
    {
        $products = Product::active()->orderBy('name')->get();
        $customers = Customer::orderBy('name')->get();

        return Inertia::render('quotations/create', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'date' => 'required|date',
            'valid_until' => 'nullable|date|after_or_equal:date',
            'discount' => 'numeric|min:0',
            'discount_type' => 'in:fixed,percent',
            'shipping_cost' => 'numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $subtotal = 0;
            $taxAmount = 0;

            foreach ($validated['items'] as &$item) {
                $product = Product::find($item['product_id']);
                $tax = $product->tax_type === 'inclusive'
                    ? $item['unit_price'] - ($item['unit_price'] / (1 + $product->tax_rate / 100))
                    : $item['unit_price'] * $product->tax_rate / 100;
                $itemTotal = ($item['unit_price'] * $item['quantity']) - ($item['discount'] ?? 0);
                $item['tax_amount'] = $tax * $item['quantity'];
                $item['total'] = $itemTotal;
                $subtotal += $itemTotal;
                $taxAmount += $item['tax_amount'];
            }
            unset($item);

            $grandTotal = $subtotal - ($validated['discount'] ?? 0) + $taxAmount + ($validated['shipping_cost'] ?? 0);

            $quotation = Quotation::create([
                'branch_id' => session('branch_id'),
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'valid_until' => $validated['valid_until'] ?? null,
                'subtotal' => $subtotal,
                'discount' => $validated['discount'] ?? 0,
                'discount_type' => $validated['discount_type'] ?? 'fixed',
                'tax_amount' => $taxAmount,
                'shipping_cost' => $validated['shipping_cost'] ?? 0,
                'grand_total' => $grandTotal,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'] ?? 0,
                    'tax_amount' => $item['tax_amount'],
                    'total' => $item['total'],
                ]);
            }

            DB::commit();

            return redirect()->route('quotations.index')->with('success', 'Quotation created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['customer', 'user', 'items.product']);

        return Inertia::render('quotations/show', ['quotation' => $quotation]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,accepted,rejected',
        ]);

        $quotation->update($validated);

        return redirect()->route('quotations.index')->with('success', 'Quotation updated successfully.');
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return redirect()->route('quotations.index')->with('success', 'Quotation deleted successfully.');
    }
}
