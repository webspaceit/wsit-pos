import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Product { id: number; name: string; sku: string; stock_quantity: number; }
interface Props { products: Product[]; }

export default function StockCountCreate({ products }: Props) {
    const { data, setData, post, processing } = useForm({
        date: new Date().toISOString().split('T')[0],
        notes: '',
        items: products.map((p) => ({ product_id: p.id, counted_quantity: p.stock_quantity })),
    });

    const updateItem = (idx: number, field: string, value: string | number) => {
        const items = [...data.items];
        (items[idx] as Record<string, unknown>)[field] = value;
        setData('items', items);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-counts', { onSuccess: () => router.get('/stock-counts') });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Counts', href: '/stock-counts' }, { title: 'Create', href: '/stock-counts/create' }]}>
            <Head title="Create Stock Count" />
            <div className="p-4 max-w-4xl">
                <h1 className="text-lg font-semibold mb-4">New Stock Count</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Notes</label><input value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted"><tr>
                                <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">SKU</th>
                                <th className="px-3 py-2 text-right">System Qty</th><th className="px-3 py-2 text-right">Counted Qty</th>
                                <th className="px-3 py-2 text-right">Difference</th>
                            </tr></thead>
                            <tbody>
                                {data.items.map((item, idx) => {
                                    const product = products.find((p) => p.id === item.product_id);
                                    const diff = item.counted_quantity - (product?.stock_quantity || 0);
                                    return (
                                        <tr key={idx} className="border-t">
                                            <td className="px-3 py-2">{product?.name}</td>
                                            <td className="px-3 py-2 text-muted-foreground">{product?.sku}</td>
                                            <td className="px-3 py-2 text-right">{product?.stock_quantity}</td>
                                            <td className="px-3 py-2 text-right"><input type="number" step="0.01" min="0" value={item.counted_quantity} onChange={(e) => updateItem(idx, 'counted_quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" /></td>
                                            <td className={`px-3 py-2 text-right font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : ''}`}>{diff > 0 ? '+' : ''}{diff.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/stock-counts')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Complete Count</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
