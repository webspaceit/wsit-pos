import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface User { id: number; name: string; email: string; phone: string; is_active: boolean; roles: Array<{ name: string }>; branch: { name: string } | null; }
interface Role { id: number; name: string; }
interface Branch { id: number; name: string; }
interface Paginated { data: User[]; current_page: number; last_page: number; total: number; }
interface Props { users: Paginated; roles: Role[]; branches: Branch[]; }

export default function UsersIndex({ users, roles, branches }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const empty = { name: '', email: '', phone: '', password: '', password_confirmation: '', branch_id: '', role: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const openEdit = (u: User) => {
        setData({ name: u.name, email: u.email, phone: u.phone ?? '', password: '', password_confirmation: '', branch_id: u.branch?.name ?? '', role: u.roles[0]?.name ?? '', is_active: u.is_active });
        setEditing(u);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/users/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/users', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <Head title="Users" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Add User</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Email</th>
                            <th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Branch</th>
                            <th className="px-3 py-2 text-center">Role</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {users.data.map((u) => (
                                <tr key={u.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{u.name}</td>
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2">{u.phone ?? '-'}</td>
                                    <td className="px-3 py-2">{u.branch?.name ?? '-'}</td>
                                    <td className="px-3 py-2 text-center"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 capitalize">{u.roles[0]?.name ?? '-'}</span></td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/users/${u.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-lg my-4">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit User' : 'Add User'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Name *</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Phone</label><input value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Password {editing ? '(leave blank to keep)' : '*'}</label><input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required={!editing} /></div>
                                <div><label className="block text-sm font-medium mb-1">Confirm Password</label><input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Role *</label>
                                    <select value={data.role} onChange={(e) => setData('role', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                        <option value="">Select</option>{roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                                    </select>{errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
                                </div>
                                <div><label className="block text-sm font-medium mb-1">Branch</label>
                                    <select value={data.branch_id} onChange={(e) => setData('branch_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                        <option value="">None</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>
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
