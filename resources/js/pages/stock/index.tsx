import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; stock_quantity: number; min_stock: number; purchase_price: number; category: { name: string } | null; unit: { short_name: string } | null; }
interface Paginated { data: Product[]; current_page: number; last_page: number; total: number; }
interface Props { products: Paginated; }

export default function StockIndex({ products }: Props) {
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [adjusting, setAdjusting] = useState<Product | null>(null);
    const [adjType, setAdjType] = useState('addition');
    const [adjQty, setAdjQty] = useState(0);
    const [adjNotes, setAdjNotes] = useState('');

    const adjust = () => {
        if (!adjusting || adjQty <= 0) return;
        router.post('/stock/adjust', { product_id: adjusting.id, type: adjType, quantity: adjQty, notes: adjNotes }, { onSuccess: () => { setAdjusting(null); setAdjQty(0); setAdjNotes(''); } });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock', href: '/stock' }]}>
            <Head title="Stock Management" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get('/stock', { search, stock_status: stockFilter }, { preserveState: true })} className="rounded-md border px-3 py-2 text-sm" />
                    <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="">All</option><option value="low">Low Stock</option><option value="out">Out of Stock</option>
                    </select>
                    <button onClick={() => router.get('/stock', { search, stock_status: stockFilter }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">SKU</th>
                            <th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-right">Current Stock</th>
                            <th className="px-3 py-2 text-right">Min Stock</th><th className="px-3 py-2 text-right">Value</th>
                            <th className="px-3 py-2 text-right">Action</th>
                        </tr></thead>
                        <tbody>
                            {products.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{p.name}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                                    <td className="px-3 py-2">{p.category?.name ?? '-'}</td>
                                    <td className="px-3 py-2 text-right">
                                        <span className={p.stock_quantity <= p.min_stock && p.min_stock > 0 ? 'text-orange-600 font-semibold' : ''}>
                                            {p.stock_quantity} {p.unit?.short_name ?? ''}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right">{p.min_stock}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.stock_quantity * p.purchase_price)}</td>
                                    <td className="px-3 py-2 text-right"><button onClick={() => { setAdjusting(p); setAdjType('addition'); setAdjQty(0); }} className="text-blue-600 hover:underline text-xs">Adjust</button></td>
                                </tr>
                            ))}
                            {products.data.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No products</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {adjusting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-96">
                        <h3 className="text-lg font-semibold mb-1">Adjust Stock</h3>
                        <p className="text-sm text-muted-foreground mb-4">{adjusting.name} (Current: {adjusting.stock_quantity})</p>
                        <div className="space-y-3">
                            <div><label className="block text-sm font-medium mb-1">Type</label>
                                <select value={adjType} onChange={(e) => setAdjType(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                    <option value="addition">Addition (+)</option><option value="subtraction">Subtraction (-)</option>
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Quantity</label><input type="number" step="0.01" value={adjQty} onChange={(e) => setAdjQty(parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" min="0.01" /></div>
                            <div><label className="block text-sm font-medium mb-1">Notes</label><input value={adjNotes} onChange={(e) => setAdjNotes(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setAdjusting(null)} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                <button onClick={adjust} disabled={adjQty <= 0} className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">Adjust</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
