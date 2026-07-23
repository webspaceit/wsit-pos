<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Product;
use App\Models\Project;
use App\Models\Purchase;
use App\Models\RepairTicket;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AiAssistantController extends Controller
{
    public function index()
    {
        $stats = [
            'today_sales' => Sale::whereDate('created_at', today())->sum('grand_total'),
            'today_purchases' => Purchase::whereDate('created_at', today())->sum('total'),
            'month_sales' => Sale::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('grand_total'),
            'month_purchases' => Purchase::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('total'),
            'total_products' => Product::count(),
            'low_stock' => Product::whereColumn('stock_quantity', '<=', 'min_stock')->where('min_stock', '>', 0)->count(),
            'total_customers' => Customer::count(),
            'total_due' => Customer::sum('balance'),
            'active_repairs' => RepairTicket::whereIn('status', ['received', 'diagnosed', 'in_repair'])->count(),
            'active_projects' => Project::whereIn('status', ['planning', 'in_progress'])->count(),
            'active_employees' => Employee::active()->count(),
            'today_expenses' => Expense::whereDate('created_at', today())->sum('amount'),
            'today_incomes' => Income::whereDate('created_at', today())->sum('amount'),
        ];

        $recentSales = Sale::with('customer')->latest()->limit(5)->get(['id', 'invoice_no', 'grand_total', 'paid_amount', 'due_amount', 'created_at']);
        $topProducts = Product::withCount('saleItems')->orderByDesc('sale_items_count')->limit(5)->get(['id', 'name', 'stock_quantity', 'selling_price']);
        $lowStockProducts = Product::lowStock()->limit(5)->get(['id', 'name', 'stock_quantity', 'min_stock']);

        return Inertia::render('ai-assistant/index', [
            'stats' => $stats,
            'recentSales' => $recentSales,
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }

    public function query(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:500',
        ]);

        $question = strtolower(trim($request->question));
        $response = $this->processQuery($question);

        return response()->json([
            'question' => $request->question,
            'answer' => $response['answer'],
            'data' => $response['data'] ?? null,
            'chart' => $response['chart'] ?? null,
        ]);
    }

    private function processQuery(string $question): array
    {
        // Sales queries
        if (str_contains($question, 'sale') && (str_contains($question, 'today') || str_contains($question, 'aaj'))) {
            $total = Sale::whereDate('created_at', today())->sum('grand_total');
            $count = Sale::whereDate('created_at', today())->count();

            return [
                'answer' => "Today's sales: ৳".number_format($total, 2)." from {$count} transactions.",
                'data' => ['total' => $total, 'count' => $count],
            ];
        }

        if (str_contains($question, 'sale') && str_contains($question, 'month')) {
            $total = Sale::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('grand_total');
            $count = Sale::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();

            return [
                'answer' => "This month's sales: ৳".number_format($total, 2)." from {$count} transactions.",
                'data' => ['total' => $total, 'count' => $count],
                'chart' => 'monthly_sales',
            ];
        }

        // Purchase queries
        if (str_contains($question, 'purchase') && str_contains($question, 'today')) {
            $total = Purchase::whereDate('created_at', today())->sum('total');

            return [
                'answer' => "Today's purchases: ৳".number_format($total, 2),
                'data' => ['total' => $total],
            ];
        }

        // Stock queries
        if (str_contains($question, 'low stock') || str_contains($question, 'out of stock') || str_contains($question, 'stock') && str_contains($question, 'kamon') || str_contains($question, 'stock') && str_contains($question, 'ki')) {
            $products = Product::lowStock()->limit(10)->get(['id', 'name', 'stock_quantity', 'min_stock']);
            $count = Product::lowStock()->count();

            return [
                'answer' => "There are {$count} products with low or out of stock.",
                'data' => $products->toArray(),
            ];
        }

        if (str_contains($question, 'total stock') || str_contains($question, 'stock value')) {
            $value = Product::sum(DB::raw('stock_quantity * selling_price'));
            $count = Product::count();

            return [
                'answer' => 'Total stock value: ৳'.number_format($value, 2)." across {$count} products.",
                'data' => ['value' => $value, 'count' => $count],
            ];
        }

        // Customer queries
        if (str_contains($question, 'due') || str_contains($question, 'receivable')) {
            $totalDue = Customer::sum('balance');
            $topDebtors = Customer::where('balance', '>', 0)->orderByDesc('balance')->limit(5)->get(['id', 'name', 'balance']);

            return [
                'answer' => 'Total receivable: ৳'.number_format($totalDue, 2).' from '.$topDebtors->count().' customers.',
                'data' => ['total_due' => $totalDue, 'top_debtors' => $topDebtors->toArray()],
            ];
        }

        if (str_contains($question, 'customer') && (str_contains($question, 'how many') || str_contains($question, 'count') || str_contains($question, 'kotojon'))) {
            $count = Customer::count();
            $active = Customer::where('is_active', true)->count();

            return [
                'answer' => "Total customers: {$count} ({$active} active)",
                'data' => ['total' => $count, 'active' => $active],
            ];
        }

        // Expense queries
        if (str_contains($question, 'expense') || str_contains($question, 'kharcha')) {
            $today = Expense::whereDate('created_at', today())->sum('amount');
            $month = Expense::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('amount');

            return [
                'answer' => "Today's expenses: ৳".number_format($today, 2)."\nThis month: ৳".number_format($month, 2),
                'data' => ['today' => $today, 'month' => $month],
            ];
        }

        // Product queries
        if (str_contains($question, 'product') && (str_contains($question, 'how many') || str_contains($question, 'count'))) {
            $count = Product::count();
            $active = Product::where('is_active', true)->count();

            return [
                'answer' => "Total products: {$count} ({$active} active)",
                'data' => ['total' => $count, 'active' => $active],
            ];
        }

        if (str_contains($question, 'top') && str_contains($question, 'product')) {
            $products = Product::withCount('saleItems')->orderByDesc('sale_items_count')->limit(5)->get(['id', 'name', 'stock_quantity']);

            return [
                'answer' => 'Top selling products by quantity:',
                'data' => $products->toArray(),
            ];
        }

        // Repair queries
        if (str_contains($question, 'repair')) {
            $active = RepairTicket::whereIn('status', ['received', 'diagnosed', 'in_repair'])->count();
            $total = RepairTicket::count();

            return [
                'answer' => "Active repairs: {$active} / Total: {$total}",
                'data' => ['active' => $active, 'total' => $total],
            ];
        }

        // Project queries
        if (str_contains($question, 'project')) {
            $active = Project::whereIn('status', ['planning', 'in_progress'])->count();
            $completed = Project::where('status', 'completed')->count();

            return [
                'answer' => "Active projects: {$active} | Completed: {$completed}",
                'data' => ['active' => $active, 'completed' => $completed],
            ];
        }

        // Profit calculation
        if (str_contains($question, 'profit')) {
            $sales = Sale::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('grand_total');
            $purchases = Purchase::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('total');
            $expenses = Expense::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('amount');
            $profit = $sales - $purchases - $expenses;

            return [
                'answer' => "This month:\nSales: ৳".number_format($sales, 2)."\nPurchases: ৳".number_format($purchases, 2)."\nExpenses: ৳".number_format($expenses, 2)."\n\n*Estimated Profit: ৳".number_format($profit, 2).'*',
                'data' => ['sales' => $sales, 'purchases' => $purchases, 'expenses' => $expenses, 'profit' => $profit],
                'chart' => 'profit_loss',
            ];
        }

        // HRM
        if (str_contains($question, 'employee') || str_contains($question, 'staff')) {
            $active = Employee::active()->count();
            $total = Employee::count();

            return [
                'answer' => "Active employees: {$active} / Total: {$total}",
                'data' => ['active' => $active, 'total' => $total],
            ];
        }

        // Default response
        return [
            'answer' => "I can help you with:\n\n📊 *Sales:* \"What are today's sales?\" or \"Monthly sales\"\n📦 *Stock:* \"Low stock products\" or \"Stock value\"\n👥 *Customers:* \"Total due\" or \"Customer count\"\n💰 *Expenses:* \"Today's expenses\"\n📈 *Profit:* \"Monthly profit\"\n🔧 *Repairs:* \"Active repairs\"\n📋 *Projects:* \"Active projects\"\n👷 *Employees:* \"Employee count\"\n\nTry asking in English or Bangla!",
        ];
    }
}
