import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Sale { id: number; invoice_no: string; grand_total: number; paid_amount: number; due_amount: number; payment_method: string; created_at: string; customer: { name: string } | null; user: { name: string }; }
interface Totals { count: number; total: number; paid: number; due: number; discount: number; tax: number; }
interface Props { sales: Sale[]; totals: Totals; byMethod: Record<string, { count: number; total: number }>; date: string }

export default function DailySales({ sales, totals, byMethod, date }: Props) {
    const [d, setD] = useState(date);

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Daily Sales', href: '/reports/daily-sales' }]}>
            <Head title="Daily Sales Report" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Daily Sales — {formatDate(date)}</h2>
                    <div className="flex items-center gap-3">
                        <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/reports/daily-sales', { date: d }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        { label: 'Sales', value: totals.count },
                        { label: 'Total', value: formatCurrency(totals.total) },
                        { label: 'Paid', value: formatCurrency(totals.paid) },
                        { label: 'Due', value: formatCurrency(totals.due) },
                        { label: 'Discount', value: formatCurrency(totals.discount) },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border p-4 text-center">
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                            <p className="text-xl font-bold">{s.value}</p>
                        </div>
                    ))}
                </div>
                {Object.keys(byMethod).length > 0 && (
                    <div className="rounded-xl border p-4">
                        <h3 className="text-sm font-semibold mb-2">By Payment Method</h3>
                        <div className="flex gap-4 flex-wrap">
                            {Object.entries(byMethod).map(([method, data]) => (
                                <div key={method} className="text-center">
                                    <p className="text-xs text-muted-foreground capitalize">{method.replace('_', ' ')}</p>
                                    <p className="font-bold">{formatCurrency(data.total)}</p>
                                    <p className="text-xs text-muted-foreground">{data.count} sales</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Invoice</th><th className="px-3 py-2 text-left">Time</th>
                            <th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-left">Cashier</th>
                            <th className="px-3 py-2 text-left">Method</th><th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2 text-right">Paid</th><th className="px-3 py-2 text-right">Due</th>
                        </tr></thead>
                        <tbody>
                            {sales.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{s.invoice_no}</td>
                                    <td className="px-3 py-2 text-xs">{new Date(s.created_at).toLocaleTimeString()}</td>
                                    <td className="px-3 py-2">{s.customer?.name || 'Walk-in'}</td>
                                    <td className="px-3 py-2">{s.user.name}</td>
                                    <td className="px-3 py-2 capitalize">{s.payment_method.replace('_', ' ')}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.grand_total)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.paid_amount)}</td>
                                    <td className={`px-3 py-2 text-right ${s.due_amount > 0 ? 'text-red-600' : ''}`}>{formatCurrency(s.due_amount)}</td>
                                </tr>
                            ))}
                            {sales.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">No sales</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
