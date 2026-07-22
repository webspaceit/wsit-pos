import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Daily { date: string; sales: number; expenses: number; profit: number; }
interface ExpenseBreakdown { name: string; total: number; }
interface Props { salesTotal: number; purchasesTotal: number; expensesTotal: number; grossProfit: number; netProfit: number; dailyBreakdown: Daily[]; expenseBreakdown: ExpenseBreakdown[]; from: string; to: string; }

export default function ProfitLossReport({ salesTotal, purchasesTotal, expensesTotal, grossProfit, netProfit, dailyBreakdown, expenseBreakdown, from, to }: Props) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);
    const filter = () => router.get('/reports/profit-loss', { from: f, to: t }, { preserveState: true });

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Profit & Loss', href: '/reports/profit-loss' }]}>
            <Head title="Profit & Loss Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Profit & Loss Report</h2>
                <div className="flex items-center gap-3">
                    <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={filter} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SummaryCard title="Sales" value={formatCurrency(salesTotal)} color="text-blue-600" />
                    <SummaryCard title="Purchases" value={formatCurrency(purchasesTotal)} color="text-orange-600" />
                    <SummaryCard title="Expenses" value={formatCurrency(expensesTotal)} color="text-red-600" />
                    <SummaryCard title="Gross Profit" value={formatCurrency(grossProfit)} color={grossProfit >= 0 ? 'text-green-600' : 'text-red-600'} />
                    <SummaryCard title="Net Profit" value={formatCurrency(netProfit)} color={netProfit >= 0 ? 'text-green-600' : 'text-red-600'} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-3">Daily Breakdown</h3>
                        <table className="w-full text-sm">
                            <thead><tr className="border-b text-muted-foreground"><th className="pb-2 text-left">Date</th><th className="pb-2 text-right">Sales</th><th className="pb-2 text-right">Expenses</th><th className="pb-2 text-right">Profit</th></tr></thead>
                            <tbody>
                                {dailyBreakdown.map((d) => (
                                    <tr key={d.date} className="border-b last:border-0"><td className="py-1.5">{formatDate(d.date)}</td><td className="py-1.5 text-right">{formatCurrency(d.sales)}</td><td className="py-1.5 text-right">{formatCurrency(d.expenses)}</td><td className={`py-1.5 text-right font-medium ${d.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(d.profit)}</td></tr>
                                ))}
                                {dailyBreakdown.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No data</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-3">Expense Breakdown</h3>
                        <table className="w-full text-sm">
                            <thead><tr className="border-b text-muted-foreground"><th className="pb-2 text-left">Category</th><th className="pb-2 text-right">Amount</th></tr></thead>
                            <tbody>
                                {expenseBreakdown.map((e, i) => (
                                    <tr key={i} className="border-b last:border-0"><td className="py-1.5">{e.name}</td><td className="py-1.5 text-right">{formatCurrency(e.total)}</td></tr>
                                ))}
                                {expenseBreakdown.length === 0 && <tr><td colSpan={2} className="py-4 text-center text-muted-foreground">No expenses</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function SummaryCard({ title, value, color }: { title: string; value: string; color: string }) {
    return <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">{title}</p><p className={`text-lg font-bold ${color}`}>{value}</p></div>;
}
