import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Coupon { id: number; code: string; description: string; type: string; value: number; min_purchase: number; max_discount: number | null; usage_limit: number | null; used_count: number; start_date: string; end_date: string; is_active: boolean; }
interface Paginated { data: Coupon[]; current_page: number; last_page: number; total: number; }
interface Props { coupons: Paginated; }

export default function CouponsIndex({ coupons }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Coupon | null>(null);
    const empty = { code: '', description: '', type: 'fixed', value: 0, min_purchase: 0, max_discount: '', usage_limit: '', start_date: new Date().toISOString().split('T')[0], end_date: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/coupons/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/coupons', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Coupons', href: '/coupons' }]}>
            <Head title="Coupons" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Coupons</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ Add Coupon</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Type</th>
                            <th className="px-3 py-2 text-right">Value</th><th className="px-3 py-2 text-right">Usage</th>
                            <th className="px-3 py-2 text-left">Valid</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {coupons.data.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs font-bold">{c.code}</td>
                                    <td className="px-3 py-2 capitalize">{c.type}</td>
                                    <td className="px-3 py-2 text-right">{c.type === 'percent' ? `${c.value}%` : `৳${c.value}`}</td>
                                    <td className="px-3 py-2 text-right">{c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ''}</td>
                                    <td className="px-3 py-2 text-xs">{formatDate(c.start_date)} - {formatDate(c.end_date)}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { setData({ code: c.code, description: c.description || '', type: c.type, value: c.value, min_purchase: c.min_purchase, max_discount: c.max_discount ?? '', usage_limit: c.usage_limit ?? '', start_date: c.start_date, end_date: c.end_date, is_active: c.is_active }); setEditing(c); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/coupons/${c.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No coupons</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Code *</label><input value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} className="w-full rounded-md border px-3 py-2 text-sm font-mono" required />{errors.code && <p className="text-xs text-red-600">{errors.code}</p>}</div>
                                <div><label className="block text-sm font-medium mb-1">Type *</label><select value={data.type} onChange={(e) => setData('type', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="fixed">Fixed</option><option value="percent">Percent</option></select></div>
                                <div><label className="block text-sm font-medium mb-1">Value *</label><input type="number" step="0.01" value={data.value} onChange={(e) => setData('value', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Min Purchase</label><input type="number" step="0.01" value={data.min_purchase} onChange={(e) => setData('min_purchase', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Max Discount</label><input type="number" step="0.01" value={data.max_discount} onChange={(e) => setData('max_discount', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Unlimited" /></div>
                                <div><label className="block text-sm font-medium mb-1">Usage Limit</label><input type="number" min="1" value={data.usage_limit} onChange={(e) => setData('usage_limit', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Unlimited" /></div>
                                <div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">End Date *</label><input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Description</label><input value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); setEditing(null); reset(); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">{editing ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
