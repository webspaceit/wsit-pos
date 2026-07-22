import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Customer { id: number; name: string; phone: string; balance: number; credit_limit: number; }
interface Paginated { data: Customer[]; current_page: number; last_page: number; total: number; }
interface Props { customers: Paginated; totalDue: number; }

export default function CustomerReport({ customers, totalDue }: Props) {
    const [search, setSearch] = useState('');

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Customer Dues', href: '/reports/customers' }]}>
            <Head title="Customer Due Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Customer Due Report</h2>
                <div className="rounded-xl border p-4 bg-orange-50 dark:bg-orange-950">
                    <p className="text-sm text-muted-foreground">Total Outstanding Due</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalDue)}</p>
                </div>
                <div className="flex items-center gap-3">
                    <input type="text" placeholder="Search customer..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get('/reports/customers', { search }, { preserveState: true })} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/reports/customers', { search }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Search</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Phone</th>
                            <th className="px-3 py-2 text-right">Balance</th><th className="px-3 py-2 text-right">Credit Limit</th>
                        </tr></thead>
                        <tbody>
                            {customers.data.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{c.name}</td>
                                    <td className="px-3 py-2">{c.phone ?? '-'}</td>
                                    <td className="px-3 py-2 text-right font-semibold text-orange-600">{formatCurrency(c.balance)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(c.credit_limit)}</td>
                                </tr>
                            ))}
                            {customers.data.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">No customers with dues</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
