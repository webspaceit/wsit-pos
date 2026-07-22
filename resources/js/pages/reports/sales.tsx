import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Row { date: string; count: number; total: number; discount: number; tax: number; paid: number; due: number; }
interface Totals { count: number; total: number; discount: number; tax: number; paid: number; due: number; }
interface Props { sales: Row[]; totals: Totals; from: string; to: string; }

export default function SalesReport({ sales, totals, from, to }: Props) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);
    const filter = () => router.get('/reports/sales', { from: f, to: t }, { preserveState: true });

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Sales', href: '/reports/sales' }]}>
            <Head title="Sales Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Sales Report</h2>
                <div className="flex items-center gap-3">
                    <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={filter} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-right">Count</th>
                            <th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-right">Discount</th>
                            <th className="px-3 py-2 text-right">Tax</th><th className="px-3 py-2 text-right">Paid</th>
                            <th className="px-3 py-2 text-right">Due</th>
                        </tr></thead>
                        <tbody>
                            {sales.map((s) => (
                                <tr key={s.date} className="border-t"><td className="px-3 py-2">{formatDate(s.date)}</td><td className="px-3 py-2 text-right">{s.count}</td><td className="px-3 py-2 text-right">{formatCurrency(s.total)}</td><td className="px-3 py-2 text-right">{formatCurrency(s.discount)}</td><td className="px-3 py-2 text-right">{formatCurrency(s.tax)}</td><td className="px-3 py-2 text-right">{formatCurrency(s.paid)}</td><td className="px-3 py-2 text-right">{formatCurrency(s.due)}</td></tr>
                            ))}
                        </tbody>
                        {totals && <tfoot><tr className="border-t font-bold bg-muted"><td className="px-3 py-2">Total</td><td className="px-3 py-2 text-right">{totals.count}</td><td className="px-3 py-2 text-right">{formatCurrency(totals.total)}</td><td className="px-3 py-2 text-right">{formatCurrency(totals.discount)}</td><td className="px-3 py-2 text-right">{formatCurrency(totals.tax)}</td><td className="px-3 py-2 text-right">{formatCurrency(totals.paid)}</td><td className="px-3 py-2 text-right">{formatCurrency(totals.due)}</td></tr></tfoot>}
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
