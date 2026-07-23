import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface GiftCard { id: number; code: string; initial_amount: number; current_balance: number; status: string; issued_date: string; expiry_date: string | null; customer: { name: string } | null; user: { name: string }; }
interface Paginated { data: GiftCard[]; current_page: number; last_page: number; total: number; }
interface Props { giftCards: Paginated; }

const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', used: 'bg-gray-100 text-gray-700', expired: 'bg-red-100 text-red-700', cancelled: 'bg-yellow-100 text-yellow-700' };

export default function GiftCardsIndex({ giftCards }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ code: '', initial_amount: 0, expiry_date: '', notes: '' });

    const submit = (e: React.FormEvent) => { e.preventDefault(); post('/gift-cards', { onSuccess: () => { setShowCreate(false); reset(); } }); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gift Cards', href: '/gift-cards' }]}>
            <Head title="Gift Cards" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Gift Cards</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ Issue Gift Card</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Customer</th>
                            <th className="px-3 py-2 text-right">Initial</th><th className="px-3 py-2 text-right">Balance</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {giftCards.data.map((gc) => (
                                <tr key={gc.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{gc.code}</td>
                                    <td className="px-3 py-2">{gc.customer?.name || '-'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(gc.initial_amount)}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(gc.current_balance)}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[gc.status]}`}>{gc.status}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/gift-cards/${gc.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        {gc.status === 'active' && <button onClick={() => { if (confirm('Cancel this card?')) router.put(`/gift-cards/${gc.id}`, { status: 'cancelled' }); }} className="text-red-600 hover:underline text-xs">Cancel</button>}
                                    </td>
                                </tr>
                            ))}
                            {giftCards.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No gift cards</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Issue Gift Card</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Code</label><input value={data.code} onChange={(e) => setData('code', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Auto-generated if empty" />{errors.code && <p className="text-xs text-red-600">{errors.code}</p>}</div>
                            <div><label className="block text-sm font-medium mb-1">Amount *</label><input type="number" step="0.01" min="1" value={data.initial_amount} onChange={(e) => setData('initial_amount', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            <div><label className="block text-sm font-medium mb-1">Expiry Date</label><input type="date" value={data.expiry_date} onChange={(e) => setData('expiry_date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); reset(); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Issue Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
