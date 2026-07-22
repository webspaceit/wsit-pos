import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, STATUSES } from '@/lib/pos-utils';

interface Sale { id: number; invoice_no: string; date: string; grand_total: number; paid_amount: number; due_amount: number; status: string; payment_method: string; customer: { name: string } | null; }
interface Paginated { data: Sale[]; current_page: number; last_page: number; total: number; }
interface Props { sales: Paginated; }

export default function SalesIndex({ sales }: Props) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [status, setStatus] = useState('');
    const filter = () => router.get('/sales', { from, to, status }, { preserveState: true });

    return (
        <AppLayout breadcrumbs={[{ title: 'Sales', href: '/sales' }]}>
            <Head title="Sales" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="">All Status</option>
                        {STATUSES.sale.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <button onClick={filter} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Invoice#</th>
                            <th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2 text-right">Paid</th><th className="px-3 py-2 text-right">Due</th>
                            <th className="px-3 py-2 text-center">Payment</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {sales.data.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2">{formatDate(s.date)}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{s.invoice_no}</td>
                                    <td className="px-3 py-2">{s.customer?.name ?? 'Walk-in'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.grand_total)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.paid_amount)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.due_amount)}</td>
                                    <td className="px-3 py-2 text-center capitalize text-xs">{s.payment_method}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${s.status === 'completed' ? 'bg-green-100 text-green-700' : s.status === 'void' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                                    </td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <Link href={`/sales/${s.id}`} className="text-blue-600 hover:underline text-xs">View</Link>
                                    </td>
                                </tr>
                            ))}
                            {sales.data.length === 0 && <tr><td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">No sales found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
