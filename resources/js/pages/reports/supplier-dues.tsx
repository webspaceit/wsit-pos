import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Supplier { id: number; name: string; phone: string; company: string | null; balance: number; }
interface Paginated { data: Supplier[]; current_page: number; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }>; }
interface Props { suppliers: Paginated; totalDue: number }

export default function SupplierDues({ suppliers, totalDue }: Props) {
    const [search, setSearch] = useState('');

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Supplier Dues', href: '/reports/supplier-dues' }]}>
            <Head title="Supplier Dues" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Supplier Dues</h2>
                    <div className="flex items-center gap-3">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/reports/supplier-dues', { search }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Search</button>
                    </div>
                </div>
                <div className="rounded-xl border p-4 bg-red-50 text-center">
                    <p className="text-sm text-muted-foreground">Total Outstanding</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</p>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Supplier</th><th className="px-3 py-2 text-left">Phone</th>
                            <th className="px-3 py-2 text-left">Company</th><th className="px-3 py-2 text-right">Due Amount</th>
                        </tr></thead>
                        <tbody>
                            {suppliers.data.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{s.name}</td>
                                    <td className="px-3 py-2">{s.phone || '-'}</td>
                                    <td className="px-3 py-2">{s.company || '-'}</td>
                                    <td className="px-3 py-2 text-right text-red-600 font-medium">{formatCurrency(s.balance)}</td>
                                </tr>
                            ))}
                            {suppliers.data.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">No outstanding dues</td></tr>}
                        </tbody>
                    </table>
                </div>
                {suppliers.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {suppliers.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url)} className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'}`}>{link.label}</button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
