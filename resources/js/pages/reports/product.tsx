import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; purchase_price: number; selling_price: number; qty_sold: number; revenue: number; cost: number; }
interface Paginated { data: Product[]; current_page: number; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }>; }
interface Props { products: Paginated; from: string; to: string }

export default function ProductReport({ products, from, to }: Props) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Product Report', href: '/reports/product' }]}>
            <Head title="Product Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Product Report</h2>
                <div className="flex items-center gap-3">
                    <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/reports/product', { from: f, to: t }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">SKU</th>
                            <th className="px-3 py-2 text-right">Cost</th><th className="px-3 py-2 text-right">Selling</th>
                            <th className="px-3 py-2 text-right">Qty Sold</th><th className="px-3 py-2 text-right">Revenue</th>
                            <th className="px-3 py-2 text-right">Profit</th><th className="px-3 py-2 text-right">Margin</th>
                        </tr></thead>
                        <tbody>
                            {products.data.map((p) => {
                                const profit = p.revenue - p.cost;
                                const margin = p.revenue > 0 ? (profit / p.revenue * 100) : 0;
                                return (
                                    <tr key={p.id} className="border-t hover:bg-muted/50">
                                        <td className="px-3 py-2">{p.name}</td>
                                        <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(p.purchase_price)}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(p.selling_price)}</td>
                                        <td className="px-3 py-2 text-right font-medium">{p.qty_sold}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(p.revenue)}</td>
                                        <td className={`px-3 py-2 text-right font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(profit)}</td>
                                        <td className={`px-3 py-2 text-right ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{margin.toFixed(1)}%</td>
                                    </tr>
                                );
                            })}
                            {products.data.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">No data</td></tr>}
                        </tbody>
                    </table>
                </div>
                {products.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {products.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url)} className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'}`}>{link.label}</button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
