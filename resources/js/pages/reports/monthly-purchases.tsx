import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Day { date: string; count: number; total: number; paid: number; due: number; }
interface Totals { count: number; total: number; paid: number; due: number; }
interface Props { daily: Day[]; totals: Totals; month: string }

export default function MonthlyPurchases({ daily, totals, month }: Props) {
    const [m, setM] = useState(month);

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Monthly Purchases', href: '/reports/monthly-purchases' }]}>
            <Head title="Monthly Purchases Report" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Monthly Purchases — {month}</h2>
                    <div className="flex items-center gap-3">
                        <input type="month" value={m} onChange={(e) => setM(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/reports/monthly-purchases', { month: m }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Purchases', value: totals.count },
                        { label: 'Total Value', value: formatCurrency(totals.total) },
                        { label: 'Paid', value: formatCurrency(totals.paid) },
                        { label: 'Outstanding', value: formatCurrency(totals.due) },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border p-4 text-center">
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                            <p className="text-xl font-bold">{s.value}</p>
                        </div>
                    ))}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-right">Count</th>
                            <th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-right">Paid</th>
                            <th className="px-3 py-2 text-right">Due</th>
                        </tr></thead>
                        <tbody>
                            {daily.map((d) => (
                                <tr key={d.date} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2">{formatDate(d.date)}</td>
                                    <td className="px-3 py-2 text-right">{d.count}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(d.total)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(d.paid)}</td>
                                    <td className={`px-3 py-2 text-right ${d.due > 0 ? 'text-red-600' : ''}`}>{formatCurrency(d.due)}</td>
                                </tr>
                            ))}
                            {daily.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No data</td></tr>}
                        </tbody>
                        <tfoot><tr className="border-t-2 font-bold bg-muted/50">
                            <td className="px-3 py-2">Total</td>
                            <td className="px-3 py-2 text-right">{totals.count}</td>
                            <td className="px-3 py-2 text-right">{formatCurrency(totals.total)}</td>
                            <td className="px-3 py-2 text-right">{formatCurrency(totals.paid)}</td>
                            <td className="px-3 py-2 text-right">{formatCurrency(totals.due)}</td>
                        </tr></tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
