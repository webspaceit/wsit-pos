import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Group { id: number; name: string; discount_percent: number; description: string | null; is_active: boolean; customers_count: number; }
interface Paginated { data: Group[]; current_page: number; last_page: number; total: number; }
interface Props { groups: Paginated }

export default function CustomerGroups({ groups }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Group | null>(null);
    const empty = { name: '', discount_percent: 0, description: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/customer-groups/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/customer-groups', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Customer Groups', href: '/customer-groups' }]}>
            <Head title="Customer Groups" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Customer Groups</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ Add Group</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Description</th>
                            <th className="px-3 py-2 text-right">Discount %</th><th className="px-3 py-2 text-right">Members</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {groups.data.map((g) => (
                                <tr key={g.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{g.name}</td>
                                    <td className="px-3 py-2 text-muted-foreground">{g.description || '-'}</td>
                                    <td className="px-3 py-2 text-right">{g.discount_percent}%</td>
                                    <td className="px-3 py-2 text-right">{g.customers_count}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{g.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { reset(); setData({ name: g.name, discount_percent: g.discount_percent, description: g.description ?? '', is_active: g.is_active }); setEditing(g); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/customer-groups/${g.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {groups.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No customer groups</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-lg font-semibold">{editing ? 'Edit Group' : 'Create Group'}</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Name *</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required />{errors.name && <p className="text-xs text-red-600">{errors.name}</p>}</div>
                            <div><label className="block text-sm font-medium mb-1">Discount % *</label><input type="number" step="0.01" min="0" max="100" value={data.discount_percent} onChange={(e) => setData('discount_percent', Number(e.target.value))} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>
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
