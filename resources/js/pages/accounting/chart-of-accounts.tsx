import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Account { id: number; account_code: string; name: string; type: string; sub_type: string | null; parent_id: number | null; description: string | null; is_active: boolean; children: Account[]; }
interface Props { accounts: Record<string, Account[]>; allAccounts: Account[]; filter: { type?: string } }

const TYPE_LABELS: Record<string, string> = { asset: 'Assets', liability: 'Liabilities', equity: 'Equity', revenue: 'Revenue', expense: 'Expenses' };
const TYPE_COLORS: Record<string, string> = { asset: 'bg-blue-100 text-blue-800', liability: 'bg-red-100 text-red-800', equity: 'bg-purple-100 text-purple-800', revenue: 'bg-green-100 text-green-800', expense: 'bg-orange-100 text-orange-800' };

export default function ChartOfAccounts({ accounts, allAccounts, filter }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Account | null>(null);
    const empty = { account_code: '', name: '', type: 'asset' as string, sub_type: '', parent_id: '', description: '', is_active: true };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/accounting/accounts/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/accounting/accounts', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chart of Accounts', href: '/accounting/accounts' }]}>
            <Head title="Chart of Accounts" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Chart of Accounts</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ Add Account</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => router.get('/accounting/accounts')} className={`rounded-full px-3 py-1 text-xs ${!filter.type ? 'bg-brand text-white' : 'bg-muted'}`}>All</button>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <button key={key} onClick={() => router.get('/accounting/accounts', { type: key })} className={`rounded-full px-3 py-1 text-xs ${filter.type === key ? 'bg-brand text-white' : 'bg-muted'}`}>{label}</button>
                    ))}
                </div>
                {Object.entries(TYPE_LABELS).map(([type, label]) => {
                    const items = accounts[type] || [];
                    if (items.length === 0) return null;
                    return (
                        <div key={type} className="space-y-2">
                            <h2 className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${TYPE_COLORS[type]}`}>{label}</h2>
                            <div className="overflow-x-auto rounded-xl border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted"><tr>
                                        <th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Name</th>
                                        <th className="px-3 py-2 text-left">Sub Type</th><th className="px-3 py-2 text-center">Status</th>
                                        <th className="px-3 py-2 text-right">Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        {items.map((a) => (
                                            <tr key={a.id} className="border-t hover:bg-muted/50">
                                                <td className="px-3 py-2 font-mono text-xs font-bold">{a.account_code}</td>
                                                <td className="px-3 py-2">{a.name}</td>
                                                <td className="px-3 py-2 capitalize text-muted-foreground">{a.sub_type || '-'}</td>
                                                <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.is_active ? 'Active' : 'Inactive'}</span></td>
                                                <td className="px-3 py-2 text-right space-x-2">
                                                    <button onClick={() => { reset(); setData({ account_code: a.account_code, name: a.name, type: a.type, sub_type: a.sub_type ?? '', parent_id: String(a.parent_id ?? ''), description: a.description ?? '', is_active: a.is_active }); setEditing(a); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/accounting/accounts/${a.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-lg font-semibold">{editing ? 'Edit Account' : 'Create Account'}</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Account Code *</label><input value={data.account_code} onChange={(e) => setData('account_code', e.target.value)} disabled={!!editing} className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-muted" required />{errors.account_code && <p className="text-xs text-red-600">{errors.account_code}</p>}</div>
                            <div><label className="block text-sm font-medium mb-1">Name *</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            <div><label className="block text-sm font-medium mb-1">Type *</label>
                                <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" disabled={!!editing}>
                                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Sub Type</label><input value={data.sub_type} onChange={(e) => setData('sub_type', e.target.value)} placeholder="e.g. cash, bank, inventory" className="w-full rounded-md border px-3 py-2 text-sm" /></div>
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
