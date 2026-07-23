import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Branch { id: number; name: string; }
interface Transfer { id: number; reference_no: string; date: string; status: string; from_branch: { name: string }; to_branch: { name: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number }>; }
interface Paginated { data: Transfer[]; current_page: number; last_page: number; total: number; }
interface Props { transfers: Paginated; branches: Branch[]; }

export default function StockTransfersIndex({ transfers }: Props) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const statusColor = (s: string) => {
        if (s === 'received') return 'bg-green-100 text-green-700';
        if (s === 'pending') return 'bg-yellow-100 text-yellow-700';
        if (s === 'in_transit') return 'bg-blue-100 text-blue-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Transfers', href: '/stock-transfers' }]}>
            <Head title="Stock Transfers" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/stock-transfers', { from, to }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    <button onClick={() => router.get('/stock-transfers/create')} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark ml-auto">+ New Transfer</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">From</th><th className="px-3 py-2 text-left">To</th>
                            <th className="px-3 py-2 text-center">Items</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {transfers.data.map((t) => (
                                <tr key={t.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{t.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(t.date)}</td>
                                    <td className="px-3 py-2">{t.from_branch.name}</td>
                                    <td className="px-3 py-2">{t.to_branch.name}</td>
                                    <td className="px-3 py-2 text-center">{t.items.length}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(t.status)}`}>{t.status.replace('_', ' ')}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/stock-transfers/${t.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        {t.status === 'pending' && <button onClick={() => { if (confirm('Receive this transfer?')) router.patch(`/stock-transfers/${t.id}/receive`); }} className="text-green-600 hover:underline text-xs">Receive</button>}
                                    </td>
                                </tr>
                            ))}
                            {transfers.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No transfers</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
