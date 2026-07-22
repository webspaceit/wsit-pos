import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CreditCard, DollarSign, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
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

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Today's Sales" value={formatCurrency(todaySales)} subtitle={`${todaySalesCount} transactions`} icon={DollarSign} color="text-green-600" />
                    <StatCard title="Monthly Sales" value={formatCurrency(monthSales)} icon={TrendingUp} color="text-blue-600" />
                    <StatCard title="Monthly Profit" value={formatCurrency(monthProfit)} icon={TrendingUp} color={monthProfit >= 0 ? 'text-green-600' : 'text-red-600'} />
                    <StatCard title="Total Due" value={formatCurrency(totalDue)} icon={CreditCard} color="text-orange-600" />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <StatCard title="Monthly Expenses" value={formatCurrency(monthExpenses)} icon={TrendingDown} color="text-red-600" />
                    <StatCard title="Due Collected" value={formatCurrency(dueCollection)} icon={CreditCard} color="text-green-600" />
                    <StatCard title="Net (Sales - Expenses)" value={formatCurrency(monthSales - monthExpenses)} icon={DollarSign} color={monthSales - monthExpenses >= 0 ? 'text-green-600' : 'text-red-600'} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Low Stock Alert */}
                    <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="mb-3 flex items-center gap-2">
                            <AlertTriangle className="size-5 text-orange-500" />
                            <h3 className="text-lg font-semibold">Low Stock Alert</h3>
                        </div>
                        {lowStockProducts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">All products are well stocked.</p>
                        ) : (
                            <div className="space-y-2">
                                {lowStockProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between text-sm">
                                        <span>{product.name}</span>
                                        <span className="text-orange-600 font-medium">
                                            {product.stock_quantity} left (min: {product.min_stock})
                                        </span>
                                    </div>
                                ))}
                                <Link href="/stock" className="text-sm text-blue-600 hover:underline">
                                    View all stock →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Sales */}
                    <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <h3 className="mb-3 text-lg font-semibold">Recent Sales</h3>
                        {recentSales.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No sales yet today.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentSales.map((sale) => (
                                    <Link key={sale.id} href={`/sales/${sale.id}`} className="flex items-center justify-between text-sm hover:underline">
                                        <span>{sale.invoice_no}</span>
                                        <span className="text-muted-foreground">{sale.customer?.name || 'Walk-in'}</span>
                                        <span className="font-medium">{formatCurrency(sale.grand_total)}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                {topProducts.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <h3 className="mb-3 text-lg font-semibold">Top Products This Month</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Product</th>
                                        <th className="pb-2 font-medium text-right">Qty Sold</th>
                                        <th className="pb-2 font-medium text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((item, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="py-2">{item.product?.name}</td>
                                            <td className="py-2 text-right">{item.total_qty}</td>
                                            <td className="py-2 text-right font-medium">{formatCurrency(item.total_revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string; subtitle?: string; icon: React.ElementType; color: string }) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <div className="flex items-center gap-3">
                <div className={`rounded-lg bg-muted p-2 ${color}`}>
                    <Icon className="size-5" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-xl font-bold">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}
