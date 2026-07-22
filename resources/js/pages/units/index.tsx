import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Unit { id: number; name: string; short_name: string; }
interface Paginated { data: Unit[]; current_page: number; last_page: number; total: number; }
interface Props { units: Paginated; }

export default function UnitsIndex({ units }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Unit | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({ name: '', short_name: '' });

    const openEdit = (u: Unit) => { setData({ name: u.name, short_name: u.short_name }); setEditing(u); };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/units/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/units', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Units', href: '/units' }]}>
            <Head title="Units" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Units</h2>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Add Unit</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Short Name</th><th className="px-3 py-2 text-right">Actions</th></tr></thead>
                        <tbody>
                            {units.data.map((u) => (
                                <tr key={u.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{u.name}</td>
                                    <td className="px-3 py-2">{u.short_name}</td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/units/${u.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-96">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Unit' : 'Add Unit'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Name</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required />{errors.name && <p className="text-xs text-red-600">{errors.name}</p>}</div>
                            <div><label className="block text-sm font-medium mb-1">Short Name</label><input value={data.short_name} onChange={(e) => setData('short_name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required />{errors.short_name && <p className="text-xs text-red-600">{errors.short_name}</p>}</div>
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
