import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, PAYMENT_METHODS } from '@/lib/pos-utils';

interface Sale { id: number; invoice_no: string; date: string; grand_total: number; paid_amount: number; due_amount: number; customer: { name: string; id: number } | null; }
interface Customer { id: number; name: string; balance: number; }
interface Paginated { data: Sale[]; current_page: number; last_page: number; total: number; }
interface Props { sales: Paginated; customers: Customer[]; totalDue: number; }

export default function DueCollectionsIndex({ sales, customers, totalDue }: Props) {
    const [collecting, setCollecting] = useState<Sale | null>(null);
    const { data, setData, post, processing, reset } = useForm({ sale_id: 0, amount: 0, payment_method: 'cash' });

    const openCollect = (sale: Sale) => {
        setCollecting(sale);
        setData({ sale_id: sale.id, amount: sale.due_amount, payment_method: 'cash' });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/due-collections', { onSuccess: () => { setCollecting(null); reset(); } });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Due Collection', href: '/due-collections' }]}>
            <Head title="Due Collection" />
            <div className="p-4 space-y-4">
                <div className="rounded-xl border p-4 bg-orange-50 dark:bg-orange-950">
                    <p className="text-sm text-muted-foreground">Total Outstanding Due</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalDue)}</p>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Invoice#</th>
                            <th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2 text-right">Paid</th><th className="px-3 py-2 text-right">Due</th>
                            <th className="px-3 py-2 text-right">Action</th>
                        </tr></thead>
                        <tbody>
                            {sales.data.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2">{formatDate(s.date)}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{s.invoice_no}</td>
                                    <td className="px-3 py-2">{s.customer?.name ?? 'Walk-in'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.grand_total)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(s.paid_amount)}</td>
                                    <td className="px-3 py-2 text-right font-semibold text-orange-600">{formatCurrency(s.due_amount)}</td>
                                    <td className="px-3 py-2 text-right"><button onClick={() => openCollect(s)} className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">Collect</button></td>
                                </tr>
                            ))}
                            {sales.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No pending dues</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {collecting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-96">
                        <h3 className="text-lg font-semibold mb-1">Collect Payment</h3>
                        <p className="text-sm text-muted-foreground mb-4">Invoice: {collecting.invoice_no} | Due: {formatCurrency(collecting.due_amount)}</p>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Amount *</label>
                                <input type="number" step="0.01" value={data.amount} onChange={(e) => setData('amount', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" required max={collecting.due_amount} />
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Payment Method *</label>
                                <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                    {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setCollecting(null); reset(); }} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                <button type="submit" disabled={processing || data.amount <= 0} className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50">{processing ? 'Processing...' : 'Collect Payment'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
