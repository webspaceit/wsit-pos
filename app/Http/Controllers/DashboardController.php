<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $branchId = session('branch_id');
        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        $baseQuery = Sale::query()->where('status', 'completed');
        if ($branchId) {
            $baseQuery->where('branch_id', $branchId);
        }

        $todaySales = (clone $baseQuery)
            ->whereDate('date', $today)
            ->sum('grand_total');

        $todaySalesCount = (clone $baseQuery)
            ->whereDate('date', $today)
            ->count();

        $monthSales = (clone $baseQuery)
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->sum('grand_total');

        $monthExpenses = Expense::query()
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->sum('amount');

        $monthProfit = $monthSales - $monthExpenses;

        $dueCollection = (clone $baseQuery)
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->sum('paid_amount');

        $totalDue = (clone $baseQuery)
            ->where('due_amount', '>', 0)
            ->sum('due_amount');

        $lowStockProducts = Product::active()
            ->lowStock()
            ->limit(5)
            ->get();

        $recentSales = (clone $baseQuery)
            ->with('customer')
            ->latest()
            ->limit(5)
            ->get();

        $topProducts = SaleItem::query()
            ->selectRaw('product_id, sum(quantity) as total_qty, sum(total) as total_revenue')
            ->whereHas('sale', function ($q) use ($branchId, $monthStart, $monthEnd) {
                $q->where('status', 'completed')
                    ->whereBetween('date', [$monthStart, $monthEnd]);
                if ($branchId) {
                    $q->where('branch_id', $branchId);
                }
            })
            ->groupBy('product_id')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->with('product')
            ->get();

        return Inertia::render('dashboard', [
            'todaySales' => (float) $todaySales,
            'todaySalesCount' => $todaySalesCount,
            'monthSales' => (float) $monthSales,
            'monthExpenses' => (float) $monthExpenses,
            'monthProfit' => (float) $monthProfit,
            'dueCollection' => (float) $dueCollection,
            'totalDue' => (float) $totalDue,
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
            'topProducts' => $topProducts,
        ]);
    }
}
