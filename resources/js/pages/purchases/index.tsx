import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, STATUSES } from '@/lib/pos-utils';

interface Purchase { id: number; reference_no: string; date: string; grand_total: number; paid_amount: number; due_amount: number; status: string; supplier: { name: string } | null; }
interface Paginated { data: Purchase[]; current_page: number; last_page: number; total: number; }
interface Props { purchases: Paginated; }

export default function PurchasesIndex({ purchases }: Props) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [status, setStatus] = useState('');
    const filter = () => router.get('/purchases', { from, to, status }, { preserveState: true });

    return (
        <AppLayout breadcrumbs={[{ title: 'Purchases', href: '/purchases' }]}>
            <Head title="Purchases" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="">All Status</option>
                        {STATUSES.purchase.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <button onClick={filter} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    <Link href="/purchases/create" className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 ml-auto">+ New Purchase</Link>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Reference</th>
                            <th className="px-3 py-2 text-left">Supplier</th><th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2 text-right">Paid</th><th className="px-3 py-2 text-right">Due</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {purchases.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2">{formatDate(p.date)}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{p.reference_no}</td>
                                    <td className="px-3 py-2">{p.supplier?.name ?? 'N/A'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.grand_total)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.paid_amount)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.due_amount)}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'received' ? 'bg-green-100 text-green-700' : p.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></td>
                                    <td className="px-3 py-2 text-right"><Link href={`/purchases/${p.id}`} className="text-blue-600 hover:underline text-xs">View</Link></td>
                                </tr>
                            ))}
                            {purchases.data.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">No purchases</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
