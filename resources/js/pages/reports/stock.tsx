import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; purchase_price: number; selling_price: number; stock_quantity: number; category: { name: string } | null; unit: { short_name: string } | null; }
interface Paginated { data: Product[]; current_page: number; last_page: number; total: number; }
interface Props { products: Paginated; totalValue: number; totalItems: number; lowStockCount: number; outOfStockCount: number; }

export default function StockReport({ products, totalValue, totalItems, lowStockCount, outOfStockCount }: Props) {
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Stock', href: '/reports/stock' }]}>
            <Head title="Stock Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Stock Report</h2>
                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Total Items</p><p className="text-lg font-bold">{totalItems.toLocaleString()}</p></div>
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-lg font-bold">{formatCurrency(totalValue)}</p></div>
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-lg font-bold text-orange-600">{lowStockCount}</p></div>
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Out of Stock</p><p className="text-lg font-bold text-red-600">{outOfStockCount}</p></div>
                </div>
                <div className="flex items-center gap-3">
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get('/reports/stock', { search, stock_status: stockFilter }, { preserveState: true })} className="rounded-md border px-3 py-2 text-sm" />
                    <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="">All</option><option value="low">Low Stock</option><option value="out">Out of Stock</option>
                    </select>
                    <button onClick={() => router.get('/reports/stock', { search, stock_status: stockFilter }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">SKU</th>
                            <th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-right">Purchase Price</th>
                            <th className="px-3 py-2 text-right">Selling Price</th><th className="px-3 py-2 text-right">Stock Qty</th>
                            <th className="px-3 py-2 text-right">Stock Value</th>
                        </tr></thead>
                        <tbody>
                            {products.data.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-3 py-2">{p.name}</td><td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                                    <td className="px-3 py-2">{p.category?.name ?? '-'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.purchase_price)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.selling_price)}</td>
                                    <td className="px-3 py-2 text-right font-medium">{p.stock_quantity} {p.unit?.short_name ?? ''}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.stock_quantity * p.purchase_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
