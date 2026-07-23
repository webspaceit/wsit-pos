import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Branch { id: number; name: string; }
interface Product { id: number; name: string; sku: string; stock_quantity: number; }
interface Props { branches: Branch[]; products: Product[]; }

export default function StockTransferCreate({ branches, products }: Props) {
    const { data, setData, post, processing } = useForm({
        from_branch_id: '',
        to_branch_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [{ product_id: '', quantity: 1 }],
    });

    const addItem = () => setData('items', [...data.items, { product_id: '', quantity: 1 }]);
    const removeItem = (idx: number) => setData('items', data.items.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: string, value: string | number) => {
        const items = [...data.items];
        (items[idx] as Record<string, unknown>)[field] = value;
        setData('items', items);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-transfers', { onSuccess: () => router.get('/stock-transfers') });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Transfers', href: '/stock-transfers' }, { title: 'Create', href: '/stock-transfers/create' }]}>
            <Head title="Create Stock Transfer" />
            <div className="p-4 max-w-3xl">
                <h1 className="text-lg font-semibold mb-4">Create Stock Transfer</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="block text-sm font-medium mb-1">From Branch *</label>
                            <select value={data.from_branch_id} onChange={(e) => setData('from_branch_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                <option value="">Select</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">To Branch *</label>
                            <select value={data.to_branch_id} onChange={(e) => setData('to_branch_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required>
                                <option value="">Select</option>{branches.filter((b) => b.id.toString() !== data.from_branch_id).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between"><h3 className="text-sm font-medium">Items</h3><button type="button" onClick={addItem} className="text-sm text-brand hover:underline">+ Add Item</button></div>
                        {data.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <select value={item.product_id} onChange={(e) => updateItem(idx, 'product_id', e.target.value)} className="flex-1 rounded-md border px-3 py-2 text-sm" required>
                                    <option value="">Select Product</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>)}
                                </select>
                                <input type="number" step="0.01" min="0.01" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded-md border px-3 py-2 text-sm" required />
                                {data.items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="text-red-600 hover:underline text-xs">Remove</button>}
                            </div>
                        ))}
                    </div>

                    <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/stock-transfers')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create Transfer</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
