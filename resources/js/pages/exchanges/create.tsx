import { Head, router } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; selling_price: number; stock_quantity: number; }
interface Sale { id: number; invoice_no: string; customer: { name: string } | null; items: Array<{ product: Product; quantity: number; unit_price: number }>; }
interface Props { sale: Sale; products: Product[]; }

export default function ExchangeCreate({ sale, products }: Props) {
    const [returnedItems, setReturnedItems] = React.useState([{ product_id: '', quantity: 1, unit_price: 0 }]);
    const [givenItems, setGivenItems] = React.useState([{ product_id: '', quantity: 1, unit_price: 0 }]);
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = React.useState('cash');
    const [reason, setReason] = React.useState('');
    const [notes, setNotes] = React.useState('');

    const updateReturned = (idx: number, field: string, value: string | number) => {
        const items = [...returnedItems];
        (items[idx] as Record<string, unknown>)[field] = value;
        if (field === 'product_id') {
            const product = products.find((p) => p.id === Number(value));
            if (product) items[idx].unit_price = product.selling_price;
        }
        setReturnedItems(items);
    };

    const updateGiven = (idx: number, field: string, value: string | number) => {
        const items = [...givenItems];
        (items[idx] as Record<string, unknown>)[field] = value;
        if (field === 'product_id') {
            const product = products.find((p) => p.id === Number(value));
            if (product) items[idx].unit_price = product.selling_price;
        }
        setGivenItems(items);
    };

    const returnedTotal = returnedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const givenTotal = givenItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const priceDifference = givenTotal - returnedTotal;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/exchanges', {
            sale_id: sale.id, date, payment_method: paymentMethod, reason, notes,
            returned_items: returnedItems.filter((i) => i.product_id),
            given_items: givenItems.filter((i) => i.product_id),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Exchanges', href: '/exchanges' }, { title: 'Create', href: '/exchanges/create' }]}>
            <Head title="Create Exchange" />
            <div className="p-4 max-w-4xl">
                <h1 className="text-lg font-semibold mb-4">Exchange for Sale — {sale.invoice_no}</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Payment Method *</label><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="cash">Cash</option><option value="card">Card</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option></select></div>
                        <div><label className="block text-sm font-medium mb-1">Reason</label><input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-red-600">Returned Items</h3>
                            {returnedItems.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <select value={item.product_id} onChange={(e) => updateReturned(idx, 'product_id', e.target.value)} className="flex-1 rounded border px-2 py-1 text-sm"><option value="">Select</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                    <input type="number" step="0.01" min="0.01" value={item.quantity} onChange={(e) => updateReturned(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-16 rounded border px-2 py-1 text-right text-sm" />
                                    <button type="button" onClick={() => setReturnedItems(returnedItems.filter((_, i) => i !== idx))} className="text-red-600 text-xs">✕</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setReturnedItems([...returnedItems, { product_id: '', quantity: 1, unit_price: 0 }])} className="text-sm text-brand hover:underline">+ Add</button>
                            <div className="mt-2 text-right font-medium">Returned: {formatCurrency(returnedTotal)}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-green-600">Given Items</h3>
                            {givenItems.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <select value={item.product_id} onChange={(e) => updateGiven(idx, 'product_id', e.target.value)} className="flex-1 rounded border px-2 py-1 text-sm"><option value="">Select</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                    <input type="number" step="0.01" min="0.01" value={item.quantity} onChange={(e) => updateGiven(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-16 rounded border px-2 py-1 text-right text-sm" />
                                    <button type="button" onClick={() => setGivenItems(givenItems.filter((_, i) => i !== idx))} className="text-red-600 text-xs">✕</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setGivenItems([...givenItems, { product_id: '', quantity: 1, unit_price: 0 }])} className="text-sm text-brand hover:underline">+ Add</button>
                            <div className="mt-2 text-right font-medium">Given: {formatCurrency(givenTotal)}</div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-3 text-right">
                        <span className="text-muted-foreground">Price Difference: </span>
                        <span className={`font-bold ${priceDifference > 0 ? 'text-red-600' : priceDifference < 0 ? 'text-green-600' : ''}`}>{priceDifference > 0 ? 'Customer pays ' : priceDifference < 0 ? 'Refund ' : ''}{formatCurrency(Math.abs(priceDifference))}</span>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/exchanges')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create Exchange</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
