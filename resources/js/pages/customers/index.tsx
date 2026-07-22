import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Customer { id: number; name: string; phone: string; email: string; balance: number; credit_limit: number; city: string; tax_id: string; is_active: boolean; }
interface Paginated { data: Customer[]; current_page: number; last_page: number; total: number; }
interface Props { customers: Paginated; }

export default function CustomersIndex({ customers }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Customer | null>(null);
    const [search, setSearch] = useState('');
    const empty = { name: '', phone: '', email: '', address: '', city: '', tax_id: '', credit_limit: 0, notes: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/customers/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/customers', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Customers', href: '/customers' }]}>
            <Head title="Customers" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get('/customers', { search }, { preserveState: true })} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/customers', { search }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Search</button>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 ml-auto">+ Add Customer</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Phone</th>
                            <th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-right">Balance</th>
                            <th className="px-3 py-2 text-right">Credit Limit</th><th className="px-3 py-2 text-center">Status</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {customers.data.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium"><Link href={`/customers/${c.id}`} className="text-blue-600 hover:underline">{c.name}</Link></td>
                                    <td className="px-3 py-2">{c.phone ?? '-'}</td><td className="px-3 py-2">{c.email ?? '-'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(c.balance)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(c.credit_limit)}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { setData(c); setEditing(c); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/customers/${c.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {customers.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No customers</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-lg my-4">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Customer' : 'Add Customer'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Name *</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required />{errors.name && <p className="text-xs text-red-600">{errors.name}</p>}</div>
                                <div><label className="block text-sm font-medium mb-1">Phone</label><input value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">City</label><input value={data.city} onChange={(e) => setData('city', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Tax ID</label><input value={data.tax_id} onChange={(e) => setData('tax_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                                <div><label className="block text-sm font-medium mb-1">Credit Limit</label><input type="number" value={data.credit_limit} onChange={(e) => setData('credit_limit', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
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
