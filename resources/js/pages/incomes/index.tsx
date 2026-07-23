import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, PAYMENT_METHODS } from '@/lib/pos-utils';

interface Income { id: number; title: string; amount: number; date: string; payment_method: string; reference_no: string; income_category: { name: string }; user: { name: string }; }
interface Category { id: number; name: string; }
interface Paginated { data: Income[]; current_page: number; last_page: number; total: number; }
interface Props { incomes: Paginated; incomeCategories: Category[]; }

export default function IncomesIndex({ incomes, incomeCategories }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Income | null>(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const empty = { income_category_id: '', title: '', amount: 0, date: new Date().toISOString().split('T')[0], payment_method: 'cash', reference_no: '', notes: '' };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/incomes/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/incomes', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Incomes', href: '/incomes' }]}>
            <Head title="Incomes" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/incomes', { from, to }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark ml-auto">+ Add Income</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Title</th>
                            <th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-right">Amount</th>
                            <th className="px-3 py-2 text-center">Payment</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {incomes.data.map((i) => (
                                <tr key={i.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2">{formatDate(i.date)}</td>
                                    <td className="px-3 py-2 font-medium">{i.title}</td>
                                    <td className="px-3 py-2">{i.income_category.name}</td>
                                    <td className="px-3 py-2 text-right text-green-600 font-medium">{formatCurrency(i.amount)}</td>
                                    <td className="px-3 py-2 text-center capitalize text-xs">{i.payment_method.replace('_', ' ')}</td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { setData({ income_category_id: '', title: i.title, amount: i.amount, date: i.date, payment_method: i.payment_method, reference_no: i.reference_no, notes: '' }); setEditing(i); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/incomes/${i.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {incomes.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No incomes</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Income' : 'Add Income'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Category *</label>
                                <select value={data.income_category_id} onChange={(e) => setData('income_category_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                    <option value="">Select</option>{incomeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>{errors.income_category_id && <p className="text-xs text-red-600">{errors.income_category_id}</p>}
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Title *</label><input value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Amount *</label><input type="number" step="0.01" value={data.amount} onChange={(e) => setData('amount', Number(e.target.value))} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Payment Method *</label>
                                <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                    {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Reference No</label><input value={data.reference_no} onChange={(e) => setData('reference_no', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
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
