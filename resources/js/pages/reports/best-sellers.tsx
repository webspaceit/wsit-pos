import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; total_qty: number; total_revenue: number; avg_price: number; }
interface Props { products: Product[]; from: string; to: string }

export default function BestSellers({ products, from, to }: Props) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);
    const [limit, setLimit] = useState('20');

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Best Sellers', href: '/reports/best-sellers' }]}>
            <Head title="Best Sellers Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Best Sellers Report</h2>
                <div className="flex items-center gap-3 flex-wrap">
                    <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <select value={limit} onChange={(e) => setLimit(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="10">Top 10</option><option value="20">Top 20</option><option value="50">Top 50</option><option value="100">Top 100</option>
                    </select>
                    <button onClick={() => router.get('/reports/best-sellers', { from: f, to: t, limit }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">Product</th>
                            <th className="px-3 py-2 text-left">SKU</th><th className="px-3 py-2 text-right">Qty Sold</th>
                            <th className="px-3 py-2 text-right">Revenue</th><th className="px-3 py-2 text-right">Avg Price</th>
                        </tr></thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{i + 1}</td>
                                    <td className="px-3 py-2">{p.name}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                                    <td className="px-3 py-2 text-right font-medium">{p.total_qty}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.total_revenue)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.avg_price)}</td>
                                </tr>
                            ))}
                            {products.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No sales data</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
