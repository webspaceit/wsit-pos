import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BarChart3, CreditCard, DollarSign, FileText, Gift, Package, Repeat, ShoppingCart, TrendingUp, Users, Clock, Activity } from 'lucide-react';

const reports = [
    { title: 'Sales Report', href: '/reports/sales', icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Daily Sales', href: '/reports/daily-sales', icon: FileText, color: 'text-blue-500' },
    { title: 'Monthly Sales', href: '/reports/monthly-sales', icon: BarChart3, color: 'text-blue-400' },
    { title: 'Purchase Report', href: '/reports/purchases', icon: ShoppingCart, color: 'text-green-600' },
    { title: 'Daily Purchases', href: '/reports/daily-purchases', icon: FileText, color: 'text-green-500' },
    { title: 'Monthly Purchases', href: '/reports/monthly-purchases', icon: BarChart3, color: 'text-green-400' },
    { title: 'Profit & Loss', href: '/reports/profit-loss', icon: DollarSign, color: 'text-purple-600' },
    { title: 'Best Sellers', href: '/reports/best-sellers', icon: Gift, color: 'text-pink-600' },
    { title: 'Product Report', href: '/reports/product', icon: Package, color: 'text-orange-600' },
    { title: 'Stock Report', href: '/reports/stock', icon: Package, color: 'text-orange-500' },
    { title: 'Payment Report', href: '/reports/payments', icon: CreditCard, color: 'text-teal-600' },
    { title: 'Tax Report', href: '/reports/tax', icon: BarChart3, color: 'text-red-600' },
    { title: 'Customer Dues', href: '/reports/customers', icon: Users, color: 'text-indigo-600' },
    { title: 'Supplier Dues', href: '/reports/supplier-dues', icon: Users, color: 'text-indigo-500' },
    { title: 'Cash Register', href: '/reports/cash-register', icon: DollarSign, color: 'text-emerald-600' },
    { title: 'Activity Log', href: '/reports/activity-log', icon: Activity, color: 'text-gray-600' },
];

export default function ReportsIndex() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }]}>
            <Head title="Reports" />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Reports</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((r) => (
                        <Link key={r.href} href={r.href} className="flex items-center gap-4 rounded-xl border p-6 transition hover:shadow-md hover:border-blue-300">
                            <div className={`rounded-lg bg-muted p-3 ${r.color}`}><r.icon className="size-6" /></div>
                            <p className="font-semibold">{r.title}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
