import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; purchase_price: number; stock_quantity: number; }
interface Damage { id: number; reference_no: string; date: string; quantity: number; unit_cost: number; total_loss: number; reason: string; product: { name: string }; user: { name: string }; }
interface Paginated { data: Damage[]; current_page: number; last_page: number; total: number; }
interface Props { damages: Paginated; products: Product[]; }

export default function DamageStockIndex({ damages, products }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({ product_id: '', quantity: 1, date: new Date().toISOString().split('T')[0], reason: '', notes: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/damage-stock', { onSuccess: () => { setShowCreate(false); reset(); } });
    };

    const totalLoss = damages.data.reduce((sum, d) => sum + d.total_loss, 0);

    return (
        <AppLayout breadcrumbs={[{ title: 'Damage Stock', href: '/damage-stock' }]}>
            <Head title="Damage Stock" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/damage-stock', { from, to }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark ml-auto">+ Report Damage</button>
                </div>

                <div className="rounded-xl border p-3 text-sm">
                    <span className="text-muted-foreground">Total Loss:</span> <span className="font-semibold text-red-600">{formatCurrency(totalLoss)}</span>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Unit Cost</th><th className="px-3 py-2 text-right">Loss</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {damages.data.map((d) => (
                                <tr key={d.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{d.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(d.date)}</td>
                                    <td className="px-3 py-2 font-medium">{d.product.name}</td>
                                    <td className="px-3 py-2 text-right">{d.quantity}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(d.unit_cost)}</td>
                                    <td className="px-3 py-2 text-right text-red-600 font-medium">{formatCurrency(d.total_loss)}</td>
                                    <td className="px-3 py-2 text-right">
                                        <button onClick={() => { if (confirm('Delete? This will restore stock.')) router.delete(`/damage-stock/${d.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {damages.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No damage records</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Report Damage</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Product *</label>
                                <select value={data.product_id} onChange={(e) => setData('product_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                    <option value="">Select</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>)}
                                </select>{errors.product_id && <p className="text-xs text-red-600">{errors.product_id}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Quantity *</label><input type="number" step="0.01" min="0.01" value={data.quantity} onChange={(e) => setData('quantity', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Reason</label><textarea value={data.reason} onChange={(e) => setData('reason', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); reset(); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Report Damage</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
