import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Quotation { id: number; reference_no: string; date: string; grand_total: number; status: string; customer: { name: string } | null; user: { name: string }; items: Array<{ product: { name: string }; quantity: number; unit_price: number }>; }
interface Paginated { data: Quotation[]; current_page: number; last_page: number; total: number; }
interface Props { quotations: Paginated; }

const statusColors: Record<string, string> = { draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', converted: 'bg-purple-100 text-purple-700' };

export default function QuotationsIndex({ quotations }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Quotations', href: '/quotations' }]}>
            <Head title="Quotations" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Quotations</h1>
                    <button onClick={() => router.get('/quotations/create')} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ New Quotation</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {quotations.data.map((q) => (
                                <tr key={q.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{q.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(q.date)}</td>
                                    <td className="px-3 py-2">{q.customer?.name || '-'}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(q.grand_total)}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[q.status] || ''}`}>{q.status}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/quotations/${q.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        {q.status === 'draft' && <button onClick={() => { if (confirm('Send quotation?')) router.put(`/quotations/${q.id}`, { status: 'sent' }); }} className="text-green-600 hover:underline text-xs">Send</button>}
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/quotations/${q.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {quotations.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No quotations</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
