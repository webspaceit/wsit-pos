import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, PAYMENT_METHODS } from '@/lib/pos-utils';

interface Expense { id: number; title: string; amount: number; date: string; payment_method: string; reference_no: string; expense_category: { name: string }; user: { name: string }; }
interface Category { id: number; name: string; }
interface Paginated { data: Expense[]; current_page: number; last_page: number; total: number; }
interface Props { expenses: Paginated; expenseCategories: Category[]; }

export default function ExpensesIndex({ expenses, expenseCategories }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const empty = { expense_category_id: '', title: '', amount: 0, date: new Date().toISOString().split('T')[0], payment_method: 'cash', reference_no: '', notes: '' };
    const { data, setData, post, put, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) { put(`/expenses/${editing.id}`, { onSuccess: () => { setEditing(null); reset(); } }); }
        else { post('/expenses', { onSuccess: () => { setShowCreate(false); reset(); } }); }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Expenses', href: '/expenses' }]}>
            <Head title="Expenses" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/expenses', { from, to }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 ml-auto">+ Add Expense</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Title</th>
                            <th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-right">Amount</th>
                            <th className="px-3 py-2 text-center">Payment</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {expenses.data.map((e) => (
                                <tr key={e.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2">{formatDate(e.date)}</td>
                                    <td className="px-3 py-2 font-medium">{e.title}</td>
                                    <td className="px-3 py-2">{e.expense_category.name}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(e.amount)}</td>
                                    <td className="px-3 py-2 text-center capitalize text-xs">{e.payment_method.replace('_', ' ')}</td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => { setData({ expense_category_id: '', title: e.title, amount: e.amount, date: e.date, payment_method: e.payment_method, reference_no: e.reference_no, notes: '' }); setEditing(e); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/expenses/${e.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {expenses.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No expenses</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {(showCreate || editing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Expense' : 'Add Expense'}</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Category *</label>
                                <select value={data.expense_category_id} onChange={(e) => setData('expense_category_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                    <option value="">Select</option>{expenseCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>{errors.expense_category_id && <p className="text-xs text-red-600">{errors.expense_category_id}</p>}
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
                            <div><label className="block text-sm font-medium mb-1">Reference #</label><input value={data.reference_no} onChange={(e) => setData('reference_no', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>
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
