import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; selling_price: number; tax_rate: number; tax_type: string; }
interface Customer { id: number; name: string; }
interface Props { products: Product[]; customers: Customer[]; }

export default function QuotationCreate({ products, customers }: Props) {
    const { data, setData, post, processing } = useForm({
        customer_id: '', date: new Date().toISOString().split('T')[0], valid_until: '',
        discount: 0, discount_type: 'fixed', shipping_cost: 0, notes: '',
        items: [{ product_id: '', quantity: 1, unit_price: 0, discount: 0 }],
    });

    const addItem = () => setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: 0, discount: 0 }]);
    const removeItem = (idx: number) => setData('items', data.items.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: string, value: string | number) => {
        const items = [...data.items];
        const item = items[idx] as Record<string, unknown>;
        item[field] = value;
        if (field === 'product_id') {
            const product = products.find((p) => p.id === Number(value));
            if (product) item.unit_price = product.selling_price;
        }
        setData('items', items);
    };

    const subtotal = data.items.reduce((sum, item) => sum + (item.unit_price * item.quantity - item.discount), 0);
    const grandTotal = subtotal - data.discount + data.shipping_cost;

    const submit = (e: React.FormEvent) => { e.preventDefault(); post('/quotations', { onSuccess: () => router.get('/quotations') }); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Quotations', href: '/quotations' }, { title: 'Create', href: '/quotations/create' }]}>
            <Head title="Create Quotation" />
            <div className="p-4 max-w-4xl">
                <h1 className="text-lg font-semibold mb-4">New Quotation</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Customer</label><select value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="">Walk-in</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Valid Until</label><input type="date" value={data.valid_until} onChange={(e) => setData('valid_until', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between"><h3 className="text-sm font-medium">Items</h3><button type="button" onClick={addItem} className="text-sm text-brand hover:underline">+ Add Item</button></div>
                        <div className="overflow-x-auto rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted"><tr>
                                    <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Price</th>
                                    <th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Disc.</th><th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2"></th>
                                </tr></thead>
                                <tbody>
                                    {data.items.map((item, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-2 py-1"><select value={item.product_id} onChange={(e) => updateItem(idx, 'product_id', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"><option value="">Select</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                            <td className="px-2 py-1 text-right"><input type="number" step="0.01" value={item.unit_price} onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" /></td>
                                            <td className="px-2 py-1 text-right"><input type="number" step="0.01" min="0.01" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-16 rounded border px-2 py-1 text-right text-sm" /></td>
                                            <td className="px-2 py-1 text-right"><input type="number" step="0.01" value={item.discount} onChange={(e) => updateItem(idx, 'discount', parseFloat(e.target.value) || 0)} className="w-16 rounded border px-2 py-1 text-right text-sm" /></td>
                                            <td className="px-2 py-1 text-right font-medium">{formatCurrency(item.unit_price * item.quantity - item.discount)}</td>
                                            <td className="px-2 py-1">{data.items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="text-red-600 text-xs">✕</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Discount</label><input type="number" step="0.01" value={data.discount} onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium mb-1">Shipping</label><input type="number" step="0.01" value={data.shipping_cost} onChange={(e) => setData('shipping_cost', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                        <div className="col-span-2 rounded-xl border p-3 text-right"><span className="text-muted-foreground">Grand Total:</span> <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span></div>
                    </div>

                    <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/quotations')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create Quotation</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
