import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Branch { id: number; name: string; phone: string; email: string; address: string; city: string; is_active: boolean; }
interface Paginated { data: Branch[]; current_page: number; last_page: number; total: number; }
interface Props { branches: Paginated; }

export default function BranchesIndex({ branches }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Branch | null>(null);
    const empty = { name: '', phone: '', email: '', address: '', city: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/branches/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/branches', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Branches', href: '/branches' }]}>
            <Head title="Branches" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Branches</h2>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Add Branch</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Phone</th>
                            <th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-left">City</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {branches.data.map((b) => (
                                <tr key={b.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{b.name}</td>
                                    <td className="px-3 py-2">{b.phone ?? '-'}</td>
                                    <td className="px-3 py-2">{b.email ?? '-'}</td>
                                    <td className="px-3 py-2">{b.city ?? '-'}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { setData(b); setEditing(b); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/branches/${b.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {branches.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No branches</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-lg my-4">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Branch' : 'Add Branch'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Name *</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required />{errors.name && <p className="text-xs text-red-600">{errors.name}</p>}</div>
                                <div><label className="block text-sm font-medium mb-1">Phone</label><input value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">City</label><input value={data.city} onChange={(e) => setData('city', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Address</label><textarea value={data.address} onChange={(e) => setData('address', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Active</label>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); setEditing(null); reset(); }} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">{processing ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
