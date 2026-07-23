import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Return { id: number; reference_no: string; date: string; grand_total: number; payment_method: string; status: string; reason: string; sale: { invoice_no: string }; customer: { name: string } | null; user: { name: string }; items: Array<{ product: { name: string }; quantity: number; unit_price: number; total: number }>; }
interface Paginated { data: Return[]; current_page: number; last_page: number; total: number; }
interface Props { returns: Paginated; }

export default function SaleReturnsIndex({ returns }: Props) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    return (
        <AppLayout breadcrumbs={[{ title: 'Sale Returns', href: '/sale-returns' }]}>
            <Head title="Sale Returns" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/sale-returns', { from, to }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Sale</th><th className="px-3 py-2 text-left">Customer</th>
                            <th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {returns.data.map((r) => (
                                <tr key={r.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{r.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(r.date)}</td>
                                    <td className="px-3 py-2">{r.sale.invoice_no}</td>
                                    <td className="px-3 py-2">{r.customer?.name || '-'}</td>
                                    <td className="px-3 py-2 text-right text-red-600 font-medium">{formatCurrency(r.grand_total)}</td>
                                    <td className="px-3 py-2 text-center"><span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 capitalize">{r.status}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/sale-returns/${r.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/sale-returns/${r.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {returns.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No sale returns</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
