import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Purchase { id: number; reference_no: string; grand_total: number; paid_amount: number; due_amount: number; status: string; supplier: { name: string } | null; user: { name: string }; }
interface Totals { count: number; total: number; paid: number; due: number; }
interface Props { purchases: Purchase[]; totals: Totals; date: string }

export default function DailyPurchases({ purchases, totals, date }: Props) {
    const [d, setD] = useState(date);

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Daily Purchases', href: '/reports/daily-purchases' }]}>
            <Head title="Daily Purchases Report" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Daily Purchases — {formatDate(date)}</h2>
                    <div className="flex items-center gap-3">
                        <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/reports/daily-purchases', { date: d }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Purchases', value: totals.count },
                        { label: 'Total', value: formatCurrency(totals.total) },
                        { label: 'Paid', value: formatCurrency(totals.paid) },
                        { label: 'Due', value: formatCurrency(totals.due) },
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
                            <th className="px-3 py-2 text-left">Reference</th><th className="px-3 py-2 text-left">Supplier</th>
                            <th className="px-3 py-2 text-left">Cashier</th><th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-right">Paid</th>
                            <th className="px-3 py-2 text-right">Due</th>
                        </tr></thead>
                        <tbody>
                            {purchases.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{p.reference_no}</td>
                                    <td className="px-3 py-2">{p.supplier?.name || '-'}</td>
                                    <td className="px-3 py-2">{p.user.name}</td>
                                    <td className="px-3 py-2 capitalize">{p.status}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.grand_total)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.paid_amount)}</td>
                                    <td className={`px-3 py-2 text-right ${p.due_amount > 0 ? 'text-red-600' : ''}`}>{formatCurrency(p.due_amount)}</td>
                                </tr>
                            ))}
                            {purchases.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No purchases</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
