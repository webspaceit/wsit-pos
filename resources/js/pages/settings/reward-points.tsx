import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface RewardEntry { id: number; customer_id: number; sale_id: number | null; points: number; type: string; description: string | null; customer: { name: string }; sale: { invoice_no: string } | null; created_at: string; }
interface Customer { id: number; name: string; reward_points: number; }
interface Paginated { data: RewardEntry[]; current_page: number; last_page: number; total: number; }
interface Props { points: Paginated; customers: Customer[] }

export default function RewardPoints({ points, customers }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const empty = { customer_id: '', points: 0, type: 'earned', description: '' };
    const { data, setData, post, processing, errors, reset } = useForm(empty);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reward-points', { onSuccess: () => { setShowCreate(false); reset(); } });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Reward Points', href: '/reward-points' }]}>
            <Head title="Reward Points" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Reward Points</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">+ Record Points</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Customer</th>
                            <th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-right">Points</th>
                            <th className="px-3 py-2 text-left">Description</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {points.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 text-xs">{formatDate(p.created_at)}</td>
                                    <td className="px-3 py-2">{p.customer.name}</td>
                                    <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${p.type === 'earned' ? 'bg-green-100 text-green-700' : p.type === 'redeemed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.type}</span></td>
                                    <td className={`px-3 py-2 text-right font-medium ${p.type === 'earned' ? 'text-green-600' : p.type === 'redeemed' ? 'text-red-600' : ''}`}>{p.type === 'redeemed' ? '-' : '+'}{p.points}</td>
                                    <td className="px-3 py-2 text-muted-foreground text-xs">{p.description || '-'}</td>
                                    <td className="px-3 py-2 text-right"><button onClick={() => { if (confirm('Delete?')) router.delete(`/reward-points/${p.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button></td>
                                </tr>
                            ))}
                            {points.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No reward entries</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-lg font-semibold">Record Reward Points</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Customer *</label>
                                <select value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                    <option value="">Select Customer</option>
                                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.reward_points} pts)</option>)}
                                </select>{errors.customer_id && <p className="text-xs text-red-600">{errors.customer_id}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium mb-1">Points *</label><input type="number" value={data.points} onChange={(e) => setData('points', Number(e.target.value))} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Type *</label>
                                    <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                        <option value="earned">Earned</option><option value="redeemed">Redeemed</option><option value="adjusted">Adjusted</option>
                                    </select>
                                </div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); reset(); }} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 rounded bg-brand text-white text-sm hover:bg-brand-dark">{processing ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
