import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Count { id: number; reference_no: string; date: string; status: string; notes: string; user: { name: string }; items: Array<{ product: { name: string }; system_quantity: number; counted_quantity: number; difference: number }>; }
interface Paginated { data: Count[]; current_page: number; last_page: number; total: number; }
interface Props { counts: Paginated; }

export default function StockCountsIndex({ counts }: Props) {
    const statusColor = (s: string) => {
        if (s === 'completed') return 'bg-green-100 text-green-700';
        if (s === 'draft') return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Counts', href: '/stock-counts' }]}>
            <Head title="Stock Counts" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Stock Counts</h1>
                    <button onClick={() => router.get('/stock-counts/create')} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ New Stock Count</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-center">Items</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {counts.data.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{c.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(c.date)}</td>
                                    <td className="px-3 py-2 text-center">{c.items.length}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(c.status)}`}>{c.status}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/stock-counts/${c.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                    </td>
                                </tr>
                            ))}
                            {counts.data.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No stock counts</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
