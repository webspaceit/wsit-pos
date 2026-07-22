import { Head, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Supplier { id: number; name: string; }
interface Props { suppliers: Supplier[]; }
interface CartItem { product_id: number; name: string; quantity: number; unit_price: number; discount: number; tax_rate: number; total: number; }

export default function PurchaseCreate({ suppliers }: Props) {
    const [supplierId, setSupplierId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [notes, setNotes] = useState('');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);

    const searchProducts = async (q: string) => {
        setSearch(q);
        if (q.length < 2) { setResults([]); return; }
        const res = await fetch(`/pos/products/search?search=${encodeURIComponent(q)}`);
        if (res.ok) setResults(await res.json());
    };

    const addItem = (product: any) => {
        if (items.find((i) => i.product_id === product.id)) return;
        setItems([...items, { product_id: product.id, name: product.name, quantity: 1, unit_price: product.purchase_price, discount: 0, tax_rate: product.tax_rate, total: product.purchase_price }]);
        setSearch(''); setResults([]);
    };

    const updateItem = (idx: number, field: string, value: number) => {
        const updated = [...items];
        (updated[idx] as any)[field] = value;
        const item = updated[idx];
        item.total = Math.max(0, (item.quantity * item.unit_price) - item.discount + ((item.quantity * item.unit_price - item.discount) * item.tax_rate / 100));
        setItems(updated);
    };

    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const grandTotal = subtotal - discount + shippingCost;
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    const submit = async () => {
        if (items.length === 0) return alert('Add at least one item');
        setProcessing(true);
        router.post('/purchases', { supplier_id: supplierId || null, date, discount, shipping_cost: shippingCost, paid_amount: paidAmount, notes, items: items.map(({ name, tax_rate, ...rest }) => rest) }, { onFinish: () => setProcessing(false) });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Purchases', href: '/purchases' }, { title: 'Create', href: '/purchases/create' }]}>
            <Head title="Create Purchase" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">New Purchase</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <div><label className="block text-sm font-medium mb-1">Supplier</label>
                        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                            <option value="">Select Supplier</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium mb-1">Search Products</label>
                    <input type="text" value={search} onChange={(e) => searchProducts(e.target.value)} placeholder="Search by name, SKU, or barcode..." className="w-full rounded-md border px-3 py-2 text-sm" />
                    {results.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white shadow-lg dark:bg-gray-800">
                            {results.map((p) => (
                                <button key={p.id} onClick={() => addItem(p)} className="w-full px-3 py-2 text-left text-sm hover:bg-muted">
                                    {p.name} ({p.sku}) - {formatCurrency(p.purchase_price)} - Stock: {p.stock}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Unit Price</th><th className="px-3 py-2 text-right">Discount</th>
                            <th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-center">Action</th>
                        </tr></thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.product_id} className="border-t">
                                    <td className="px-3 py-2">{item.name}</td>
                                    <td className="px-3 py-2 text-right"><input type="number" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-20 rounded border px-2 py-1 text-right text-sm" min="0.01" step="0.01" /></td>
                                    <td className="px-3 py-2 text-right"><input type="number" value={item.unit_price} onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" min="0" step="0.01" /></td>
                                    <td className="px-3 py-2 text-right"><input type="number" value={item.discount} onChange={(e) => updateItem(idx, 'discount', parseFloat(e.target.value) || 0)} className="w-20 rounded border px-2 py-1 text-right text-sm" min="0" step="0.01" /></td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                                    <td className="px-3 py-2 text-center"><button onClick={() => removeItem(idx)} className="text-red-600 hover:underline text-xs">Remove</button></td>
                                </tr>
                            ))}
                            {items.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">Search and add products above</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-72 space-y-2 rounded-xl border p-4">
                        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                        <div className="flex items-center justify-between text-sm"><span>Discount</span><input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" min="0" /></div>
                        <div className="flex items-center justify-between text-sm"><span>Shipping</span><input type="number" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" min="0" /></div>
                        <div className="flex justify-between border-t pt-2 font-semibold"><span>Grand Total</span><span>{formatCurrency(grandTotal)}</span></div>
                        <div className="flex items-center justify-between text-sm"><span>Paid Amount</span><input type="number" value={paidAmount} onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" min="0" /></div>
                        <div className="flex justify-between text-sm text-red-600 font-semibold"><span>Due</span><span>{formatCurrency(dueAmount)}</span></div>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." className="w-full rounded-md border px-3 py-2 text-sm mt-2" rows={2} />
                        <button onClick={submit} disabled={processing || items.length === 0} className="w-full rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50 mt-2">{processing ? 'Saving...' : 'Create Purchase'}</button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
