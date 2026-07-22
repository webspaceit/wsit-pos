import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Package,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Props {
    todaySales: number;
    todaySalesCount: number;
    monthSales: number;
    monthExpenses: number;
    monthProfit: number;
    dueCollection: number;
    totalDue: number;
    lowStockProducts: Array<{ id: number; name: string; stock_quantity: number; min_stock: number }>;
    recentSales: Array<{ id: number; invoice_no: string; grand_total: number; date: string; customer: { name: string } | null }>;
    topProducts: Array<{ total_qty: number; total_revenue: number; product: { name: string } }>;
}

export default function Dashboard({
    todaySales,
    todaySalesCount,
    monthSales,
    monthExpenses,
    monthProfit,
    dueCollection,
    totalDue,
    lowStockProducts,
    recentSales,
    topProducts,
}: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 lg:p-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-brand-dark p-6 text-white shadow-lg">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative">
                        <h1 className="text-2xl font-bold">Welcome back!</h1>
                        <p className="mt-1 text-green-100">
                            Here&apos;s what&apos;s happening with your store today.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                href="/pos"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand shadow transition hover:bg-brand-50"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Open POS Terminal
                            </Link>
                            <Link
                                href="/products/create"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                <Package className="h-4 w-4" />
                                Add Product
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Today's Sales"
                        value={formatCurrency(todaySales)}
                        subtitle={`${todaySalesCount} transactions`}
                        icon={DollarSign}
                        trend="+12%"
                        trendUp={true}
                        gradient="from-brand to-brand-light"
                    />
                    <StatCard
                        title="Monthly Sales"
                        value={formatCurrency(monthSales)}
                        subtitle="This month"
                        icon={TrendingUp}
                        trend="+8%"
                        trendUp={true}
                        gradient="from-brand-dark to-brand"
                    />
                    <StatCard
                        title="Monthly Profit"
                        value={formatCurrency(monthProfit)}
                        subtitle={monthProfit >= 0 ? 'Profitable' : 'Needs attention'}
                        icon={monthProfit >= 0 ? TrendingUp : TrendingDown}
                        trend={monthProfit >= 0 ? '+' : ''}
                        trendUp={monthProfit >= 0}
                        gradient={monthProfit >= 0 ? 'from-brand to-brand-light' : 'from-red-500 to-rose-500'}
                    />
                    <StatCard
                        title="Total Due"
                        value={formatCurrency(totalDue)}
                        subtitle={`৳${dueCollection.toLocaleString()} collected`}
                        icon={CreditCard}
                        trend=""
                        trendUp={false}
                        gradient="from-amber-500 to-orange-500"
                    />
                </div>

                {/* Second Row Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <MiniStatCard
                        title="Monthly Expenses"
                        value={formatCurrency(monthExpenses)}
                        icon={TrendingDown}
                        color="text-red-500"
                        bg="bg-red-50"
                    />
                    <MiniStatCard
                        title="Due Collected"
                        value={formatCurrency(dueCollection)}
                        icon={CreditCard}
                        color="text-brand"
                        bg="bg-brand-50"
                    />
                    <MiniStatCard
                        title="Net Income"
                        value={formatCurrency(monthSales - monthExpenses)}
                        icon={DollarSign}
                        color={monthSales - monthExpenses >= 0 ? 'text-blue-500' : 'text-red-500'}
                        bg={monthSales - monthExpenses >= 0 ? 'bg-blue-50' : 'bg-red-50'}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Low Stock Alert */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-orange-100 p-1.5">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Low Stock</h3>
                            </div>
                            <Link href="/stock" className="text-xs font-medium text-brand hover:text-brand-dark">
                                View All
                            </Link>
                        </div>
                        {lowStockProducts.length === 0 ? (
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="rounded-full bg-green-100 p-3">
                                    <Package className="h-6 w-6 text-green-600" />
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-900">All stocked up!</p>
                                <p className="text-xs text-gray-500">No low stock alerts</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lowStockProducts.slice(0, 5).map((product) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-orange-400"
                                                        style={{
                                                            width: `${Math.min((product.stock_quantity / product.min_stock) * 100, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-orange-600">
                                                    {product.stock_quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {lowStockProducts.length > 5 && (
                                    <p className="text-center text-xs text-gray-500">
                                        +{lowStockProducts.length - 5} more items
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recent Sales */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-brand-100 p-1.5">
                                    <ShoppingCart className="h-4 w-4 text-brand" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Sales</h3>
                            </div>
                            <Link href="/sales" className="text-xs font-medium text-brand hover:text-brand-dark">
                                View All
                            </Link>
                        </div>
                        {recentSales.length === 0 ? (
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="rounded-full bg-gray-100 p-3">
                                    <ShoppingCart className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-900">No sales yet</p>
                                <p className="text-xs text-gray-500">Start selling to see data here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentSales.slice(0, 5).map((sale) => (
                                    <Link
                                        key={sale.id}
                                        href={`/sales/${sale.id}`}
                                        className="flex items-center justify-between rounded-lg p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {sale.invoice_no}
                                            </p>
                                            <p className="text-xs text-gray-500">{sale.customer?.name || 'Walk-in'}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(sale.grand_total)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Products */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-brand-100 p-1.5">
                                    <Zap className="h-4 w-4 text-brand" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Products</h3>
                            </div>
                            <Link href="/reports/sales" className="text-xs font-medium text-brand hover:text-brand-dark">
                                View Reports
                            </Link>
                        </div>
                        {topProducts.length === 0 ? (
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="rounded-full bg-gray-100 p-3">
                                    <Package className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-900">No data yet</p>
                                <p className="text-xs text-gray-500">Top products will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topProducts.slice(0, 5).map((item, i) => {
                                    const maxQty = topProducts[0]?.total_qty || 1;
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.product?.name}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className="h-full rounded-full bg-brand"
                                                            style={{ width: `${(item.total_qty / maxQty) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">
                                                        {item.total_qty} sold
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(item.total_revenue)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendUp,
    gradient,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    trend: string;
    trendUp: boolean;
    gradient: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div className={`rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-white shadow-lg`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1">
                    <span className={`text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {trend}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                </div>
            )}
        </div>
    );
}

function MiniStatCard({
    title,
    value,
    icon: Icon,
    color,
    bg,
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className={`rounded-xl ${bg} p-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}
