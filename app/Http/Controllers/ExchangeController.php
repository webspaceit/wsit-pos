<?php

namespace App\Http\Controllers;

use App\Models\Exchange;
use App\Models\ExchangeItem;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExchangeController extends Controller
{
    public function index(Request $request)
    {
        $exchanges = Exchange::query()
            ->with(['customer', 'sale', 'user', 'items.product'])
            ->when($request->from, fn ($q) => $q->where('date', '>=', $request->from))
            ->when($request->to, fn ($q) => $q->where('date', '<=', $request->to))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('exchanges/index', ['exchanges' => $exchanges]);
    }

    public function create(Request $request)
    {
        $sale = Sale::with(['items.product', 'customer'])->findOrFail($request->sale_id);
        $products = Product::active()->orderBy('name')->get();

        return Inertia::render('exchanges/create', [
            'sale' => $sale,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'customer_id' => 'nullable|exists:customers,id',
            'date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bkash,nagad,rocket,bank_transfer,cheque,other',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
            'returned_items' => 'required|array|min:1',
            'returned_items.*.product_id' => 'required|exists:products,id',
            'returned_items.*.quantity' => 'required|numeric|min:0.01',
            'returned_items.*.unit_price' => 'required|numeric|min:0',
            'given_items' => 'required|array|min:1',
            'given_items.*.product_id' => 'required|exists:products,id',
            'given_items.*.quantity' => 'required|numeric|min:0.01',
            'given_items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $returnedTotal = 0;
            foreach ($validated['returned_items'] as $item) {
                $returnedTotal += $item['unit_price'] * $item['quantity'];
            }

            $givenTotal = 0;
            foreach ($validated['given_items'] as $item) {
                $givenTotal += $item['unit_price'] * $item['quantity'];
            }

            $exchange = Exchange::create([
                'branch_id' => session('branch_id'),
                'sale_id' => $validated['sale_id'],
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'price_difference' => $givenTotal - $returnedTotal,
                'payment_method' => $validated['payment_method'],
                'reason' => $validated['reason'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['returned_items'] as $item) {
                ExchangeItem::create([
                    'exchange_id' => $exchange->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['unit_price'] * $item['quantity'],
                    'direction' => 'returned',
                ]);
                Product::where('id', $item['product_id'])->increment('stock_quantity', $item['quantity']);
            }

            foreach ($validated['given_items'] as $item) {
                ExchangeItem::create([
                    'exchange_id' => $exchange->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['unit_price'] * $item['quantity'],
                    'direction' => 'given',
                ]);
                Product::where('id', $item['product_id'])->decrement('stock_quantity', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('exchanges.index')->with('success', 'Exchange created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Exchange $exchange)
    {
        $exchange->load(['customer', 'sale', 'user', 'items.product']);

        return Inertia::render('exchanges/show', ['exchange' => $exchange]);
    }

    public function destroy(Exchange $exchange)
    {
        DB::beginTransaction();
        try {
            foreach ($exchange->items as $item) {
                if ($item->direction === 'returned') {
                    Product::where('id', $item->product_id)->decrement('stock_quantity', $item->quantity);
                } else {
                    Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
                }
            }
            $exchange->delete();
            DB::commit();

            return redirect()->route('exchanges.index')->with('success', 'Exchange deleted.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
