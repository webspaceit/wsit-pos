<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Expense;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('reports/index');
    }

    public function sales(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();

        $sales = Sale::query()
            ->where('status', 'completed')
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('date, count(*) as count, sum(grand_total) as total, sum(discount) as discount, sum(tax_amount) as tax, sum(paid_amount) as paid, sum(due_amount) as due')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totals = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('count(*) as count, sum(grand_total) as total, sum(discount) as discount, sum(tax_amount) as tax, sum(paid_amount) as paid, sum(due_amount) as due')
            ->first();

        return Inertia::render('reports/sales', [
            'sales' => $sales,
            'totals' => $totals,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function purchases(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();

        $purchases = Purchase::query()
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('date, count(*) as count, sum(grand_total) as total, sum(discount) as discount, sum(tax_amount) as tax, sum(paid_amount) as paid, sum(due_amount) as due')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totals = Purchase::byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('count(*) as count, sum(grand_total) as total, sum(discount) as discount, sum(tax_amount) as tax, sum(paid_amount) as paid, sum(due_amount) as due')
            ->first();

        return Inertia::render('reports/purchases', [
            'purchases' => $purchases,
            'totals' => $totals,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function profitLoss(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();

        $salesTotal = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->sum('grand_total');

        $purchasesTotal = Purchase::byBranch($branchId)
            ->byDateRange($from, $to)
            ->sum('grand_total');

        $expensesTotal = Expense::byBranch($branchId)
            ->byDateRange($from, $to)
            ->sum('amount');

        $cogs = $purchasesTotal;
        $grossProfit = $salesTotal - $cogs;
        $netProfit = $grossProfit - $expensesTotal;

        $dailyBreakdown = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('date, sum(grand_total) as sales')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($sale) use ($branchId) {
                $expenses = Expense::byBranch($branchId)
                    ->whereDate('date', $sale->date)
                    ->sum('amount');

                return [
                    'date' => $sale->date,
                    'sales' => (float) $sale->sales,
                    'expenses' => (float) $expenses,
                    'profit' => (float) $sale->sales - $expenses,
                ];
            });

        $expenseBreakdown = Expense::byBranch($branchId)
            ->byDateRange($from, $to)
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->selectRaw('expense_categories.name, sum(expenses.amount) as total')
            ->groupBy('expense_categories.name')
            ->get();

        return Inertia::render('reports/profit-loss', [
            'salesTotal' => (float) $salesTotal,
            'purchasesTotal' => (float) $purchasesTotal,
            'expensesTotal' => (float) $expensesTotal,
            'grossProfit' => (float) $grossProfit,
            'netProfit' => (float) $netProfit,
            'dailyBreakdown' => $dailyBreakdown,
            'expenseBreakdown' => $expenseBreakdown,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function stock(Request $request)
    {
        $products = Product::query()
            ->with(['category', 'unit'])
            ->search($request->search)
            ->when($request->stock_status === 'low', fn ($q) => $q->lowStock())
            ->when($request->stock_status === 'out', fn ($q) => $q->where('stock_quantity', '<=', 0))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        $totalValue = Product::where('is_active', true)->sum(DB::raw('stock_quantity * purchase_price'));
        $totalItems = Product::where('is_active', true)->sum('stock_quantity');
        $lowStockCount = Product::active()->lowStock()->count();
        $outOfStockCount = Product::where('is_active', true)->where('stock_quantity', '<=', 0)->count();

        return Inertia::render('reports/stock', [
            'products' => $products,
            'totalValue' => (float) $totalValue,
            'totalItems' => (float) $totalItems,
            'lowStockCount' => $lowStockCount,
            'outOfStockCount' => $outOfStockCount,
        ]);
    }

    public function tax(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();

        $salesTax = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->sum('tax_amount');

        $purchaseTax = Purchase::byBranch($branchId)
            ->byDateRange($from, $to)
            ->sum('tax_amount');

        $taxByProduct = SaleItem::query()
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('sales.status', 'completed')
            ->where('sales.branch_id', $branchId)
            ->whereBetween('sales.date', [$from, $to])
            ->selectRaw('products.name, sum(sale_items.tax_amount) as tax_amount, sum(sale_items.total) as total')
            ->groupBy('products.name')
            ->orderByDesc('tax_amount')
            ->limit(20)
            ->get();

        return Inertia::render('reports/tax', [
            'salesTax' => (float) $salesTax,
            'purchaseTax' => (float) $purchaseTax,
            'netTax' => (float) ($salesTax - $purchaseTax),
            'taxByProduct' => $taxByProduct,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function customers(Request $request)
    {
        $customers = Customer::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderByDesc('balance')
            ->paginate(20)
            ->withQueryString();

        $totalDue = Customer::sum('balance');

        return Inertia::render('reports/customers', [
            'customers' => $customers,
            'totalDue' => (float) $totalDue,
        ]);
    }
}
