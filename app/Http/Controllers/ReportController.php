<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Supplier;
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

    public function bestSellers(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();
        $limit = (int) ($request->limit ?? 20);

        $products = SaleItem::query()
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('sales.status', 'completed')
            ->where('sales.branch_id', $branchId)
            ->whereBetween('sales.date', [$from, $to])
            ->selectRaw('products.id, products.name, products.sku, sum(sale_items.quantity) as total_qty, sum(sale_items.total) as total_revenue, avg(sale_items.unit_price) as avg_price')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_qty')
            ->limit($limit)
            ->get();

        return Inertia::render('reports/best-sellers', [
            'products' => $products,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function productReport(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();

        $products = SaleItem::query()
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('sales.status', 'completed')
            ->where('sales.branch_id', $branchId)
            ->whereBetween('sales.date', [$from, $to])
            ->selectRaw('products.id, products.name, products.sku, products.purchase_price, products.selling_price, sum(sale_items.quantity) as qty_sold, sum(sale_items.total) as revenue, sum(sale_items.quantity * products.purchase_price) as cost')
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.purchase_price', 'products.selling_price')
            ->orderByDesc('revenue')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('reports/product', [
            'products' => $products,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function dailySales(Request $request)
    {
        $branchId = session('branch_id');
        $date = $request->date ?? now()->toDateString();

        $sales = Sale::query()
            ->with(['customer', 'user'])
            ->where('status', 'completed')
            ->byBranch($branchId)
            ->whereDate('date', $date)
            ->orderBy('created_at')
            ->get();

        $totals = [
            'count' => $sales->count(),
            'total' => $sales->sum('grand_total'),
            'paid' => $sales->sum('paid_amount'),
            'due' => $sales->sum('due_amount'),
            'discount' => $sales->sum('discount'),
            'tax' => $sales->sum('tax_amount'),
        ];

        $byMethod = $sales->groupBy('payment_method')->map(fn ($g) => [
            'count' => $g->count(),
            'total' => $g->sum('grand_total'),
        ]);

        return Inertia::render('reports/daily-sales', [
            'sales' => $sales,
            'totals' => $totals,
            'byMethod' => $byMethod,
            'date' => $date,
        ]);
    }

    public function monthlySales(Request $request)
    {
        $branchId = session('branch_id');
        $month = $request->month ?? now()->format('Y-m');

        $from = $month.'-01';
        $to = now()->parse($from)->endOfMonth()->toDateString();

        $daily = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->whereBetween('date', [$from, $to])
            ->selectRaw('date, count(*) as count, sum(grand_total) as total, sum(paid_amount) as paid, sum(due_amount) as due')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totals = [
            'count' => $daily->sum('count'),
            'total' => $daily->sum('total'),
            'paid' => $daily->sum('paid'),
            'due' => $daily->sum('due'),
        ];

        return Inertia::render('reports/monthly-sales', [
            'daily' => $daily,
            'totals' => $totals,
            'month' => $month,
        ]);
    }

    public function dailyPurchases(Request $request)
    {
        $branchId = session('branch_id');
        $date = $request->date ?? now()->toDateString();

        $purchases = Purchase::query()
            ->with(['supplier', 'user'])
            ->byBranch($branchId)
            ->whereDate('date', $date)
            ->orderBy('created_at')
            ->get();

        $totals = [
            'count' => $purchases->count(),
            'total' => $purchases->sum('grand_total'),
            'paid' => $purchases->sum('paid_amount'),
            'due' => $purchases->sum('due_amount'),
        ];

        return Inertia::render('reports/daily-purchases', [
            'purchases' => $purchases,
            'totals' => $totals,
            'date' => $date,
        ]);
    }

    public function monthlyPurchases(Request $request)
    {
        $branchId = session('branch_id');
        $month = $request->month ?? now()->format('Y-m');

        $from = $month.'-01';
        $to = now()->parse($from)->endOfMonth()->toDateString();

        $daily = Purchase::byBranch($branchId)
            ->whereBetween('date', [$from, $to])
            ->selectRaw('date, count(*) as count, sum(grand_total) as total, sum(paid_amount) as paid, sum(due_amount) as due')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totals = [
            'count' => $daily->sum('count'),
            'total' => $daily->sum('total'),
            'paid' => $daily->sum('paid'),
            'due' => $daily->sum('due'),
        ];

        return Inertia::render('reports/monthly-purchases', [
            'daily' => $daily,
            'totals' => $totals,
            'month' => $month,
        ]);
    }

    public function payments(Request $request)
    {
        $branchId = session('branch_id');
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to = $request->to ?? now()->toDateString();

        $salePayments = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('payment_method, count(*) as count, sum(paid_amount) as total')
            ->groupBy('payment_method')
            ->get();

        $purchasePayments = Purchase::byBranch($branchId)
            ->byDateRange($from, $to)
            ->selectRaw('payment_method, count(*) as count, sum(paid_amount) as total')
            ->groupBy('payment_method')
            ->get();

        return Inertia::render('reports/payments', [
            'salePayments' => $salePayments,
            'purchasePayments' => $purchasePayments,
            'from' => $from,
            'to' => $to,
        ]);
    }

    public function supplierDues(Request $request)
    {
        $suppliers = Supplier::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->where('balance', '>', 0)
            ->orderByDesc('balance')
            ->paginate(20)
            ->withQueryString();

        $totalDue = Supplier::sum('balance');

        return Inertia::render('reports/supplier-dues', [
            'suppliers' => $suppliers,
            'totalDue' => (float) $totalDue,
        ]);
    }

    public function cashRegister(Request $request)
    {
        $branchId = session('branch_id');
        $date = $request->date ?? now()->toDateString();

        $salesIn = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->whereDate('date', $date)
            ->where('payment_method', 'cash')
            ->sum('paid_amount');

        $expensesOut = Expense::byBranch($branchId)
            ->whereDate('date', $date)
            ->where('payment_method', 'cash')
            ->sum('amount');

        $incomeIn = Income::byBranch($branchId)
            ->whereDate('date', $date)
            ->where('payment_method', 'cash')
            ->sum('amount');

        $allSalesByMethod = Sale::where('status', 'completed')
            ->byBranch($branchId)
            ->whereDate('date', $date)
            ->selectRaw('payment_method, count(*) as count, sum(paid_amount) as total')
            ->groupBy('payment_method')
            ->get();

        $allExpensesByMethod = Expense::byBranch($branchId)
            ->whereDate('date', $date)
            ->selectRaw('payment_method, count(*) as count, sum(amount) as total')
            ->groupBy('payment_method')
            ->get();

        return Inertia::render('reports/cash-register', [
            'salesIn' => (float) $salesIn,
            'expensesOut' => (float) $expensesOut,
            'incomeIn' => (float) $incomeIn,
            'netCash' => (float) ($salesIn + $incomeIn - $expensesOut),
            'allSalesByMethod' => $allSalesByMethod,
            'allExpensesByMethod' => $allExpensesByMethod,
            'date' => $date,
        ]);
    }

    public function activityLog(Request $request)
    {
        $logs = ActivityLog::query()
            ->with('user')
            ->when($request->type, fn ($q) => $q->where('type', $request->type))
            ->latest()
            ->paginate(50)
            ->withQueryString();

        $types = ActivityLog::distinct()->pluck('type')->filter();

        return Inertia::render('reports/activity-log', [
            'logs' => $logs,
            'types' => $types,
            'filter' => $request->only('type'),
        ]);
    }
}
