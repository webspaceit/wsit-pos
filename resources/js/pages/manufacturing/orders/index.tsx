import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manufacturing', href: '/manufacturing/orders' },
    { title: 'Production Orders', href: '/manufacturing/orders' },
];

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' };

export default function ProductionOrders({ orders, recipes, branches, filters }: { orders: { data: any[]; links: any[] }; recipes: any[]; branches: any[]; filters: any }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        recipe_id: '', branch_id: branches[0]?.id ? String(branches[0].id) : '', date: new Date().toISOString().split('T')[0], quantity_to_produce: '1', notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/manufacturing/orders', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Production Orders" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Production Orders</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ New Order</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">New Production Order</h2>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                            <div><label className="block text-sm font-medium">Recipe *</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.recipe_id} onChange={e => setData('recipe_id', e.target.value)}><option value="">Select</option>{recipes.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.product?.name})</option>)}</select></div>
                            <div><label className="block text-sm font-medium">Branch *</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.branch_id} onChange={e => setData('branch_id', e.target.value)}><option value="">Select</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium">Date *</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.date} onChange={e => setData('date', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Quantity to Produce *</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.quantity_to_produce} onChange={e => setData('quantity_to_produce', e.target.value)} /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium">Notes</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Create Order</button>
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Ref</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Recipe</th><th className="px-4 py-3 text-left">Branch</th><th className="px-4 py-3 text-left">Qty</th><th className="px-4 py-3 text-left">Produced</th><th className="px-4 py-3 text-left">Cost</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                        <tbody>
                            {orders.data.map((o: any) => (
                                <tr key={o.id} className="border-t">
                                    <td className="px-4 py-3 font-mono text-sm">{o.reference_no}</td>
                                    <td className="px-4 py-3">{o.date}</td>
                                    <td className="px-4 py-3">{o.recipe?.name}</td>
                                    <td className="px-4 py-3">{o.branch?.name}</td>
                                    <td className="px-4 py-3">{o.quantity_to_produce}</td>
                                    <td className="px-4 py-3">{o.quantity_produced}</td>
                                    <td className="px-4 py-3">৳{Number(o.total_cost).toLocaleString()}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[o.status] || ''}`}>{o.status.replace('_', ' ')}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {o.status !== 'completed' && o.status !== 'cancelled' && (
                                                <>
                                                    {o.status === 'pending' && <button onClick={() => router.put(`/manufacturing/orders/${o.id}/status`, { status: 'in_progress' })} className="text-blue-600 hover:underline text-sm">Start</button>}
                                                    <button onClick={() => router.put(`/manufacturing/orders/${o.id}/status`, { status: 'completed', quantity_produced: o.quantity_to_produce })} className="text-emerald-600 hover:underline text-sm">Complete</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!orders.data.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No orders</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
