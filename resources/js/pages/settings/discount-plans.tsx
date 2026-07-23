import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface DiscountPlan { id: number; name: string; type: string; value: number; min_purchase: number; max_discount: number | null; start_date: string | null; end_date: string | null; is_active: boolean; }
interface Paginated { data: DiscountPlan[]; current_page: number; last_page: number; total: number; }
interface Props { plans: Paginated }

export default function DiscountPlans({ plans }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<DiscountPlan | null>(null);
    const empty = { name: '', type: 'percent', value: 0, min_purchase: 0, max_discount: '', start_date: '', end_date: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/settings/discount-plans/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/settings/discount-plans', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Settings', href: '/settings' }, { title: 'Discount Plans', href: '/settings/discount-plans' }]}>
            <Head title="Discount Plans" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Discount Plans</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ Add Plan</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Type</th>
                            <th className="px-3 py-2 text-right">Value</th><th className="px-3 py-2 text-right">Min Purchase</th>
                            <th className="px-3 py-2 text-left">Valid</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {plans.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{p.name}</td>
                                    <td className="px-3 py-2 capitalize">{p.type}</td>
                                    <td className="px-3 py-2 text-right">{p.type === 'percent' ? `${p.value}%` : formatCurrency(p.value)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.min_purchase)}</td>
                                    <td className="px-3 py-2 text-xs">{p.start_date || 'Any'} — {p.end_date || 'Any'}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { reset(); setData({ name: p.name, type: p.type, value: p.value, min_purchase: p.min_purchase, max_discount: String(p.max_discount ?? ''), start_date: p.start_date ?? '', end_date: p.end_date ?? '', is_active: p.is_active }); setEditing(p); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/settings/discount-plans/${p.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {plans.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No discount plans</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-lg font-semibold">{editing ? 'Edit Plan' : 'Create Plan'}</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Name *</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Type *</label>
                                    <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                        <option value="percent">Percent</option><option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium mb-1">Value *</label><input type="number" step="0.01" value={data.value} onChange={(e) => setData('value', Number(e.target.value))} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Min Purchase</label><input type="number" step="0.01" value={data.min_purchase} onChange={(e) => setData('min_purchase', Number(e.target.value))} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Max Discount</label><input type="number" step="0.01" value={data.max_discount} onChange={(e) => setData('max_discount', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            </div>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Active</label>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); setEditing(null); reset(); }} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 rounded bg-brand text-white text-sm hover:bg-brand-dark">{processing ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
