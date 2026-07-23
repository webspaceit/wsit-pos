import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Product { id: number; name: string; stock_quantity: number; }
interface SaleItem { product: Product; quantity: number; }
interface Sale { id: number; invoice_no: string; items: SaleItem[]; }
interface Props { sale: Sale; }

export default function PackingSlipCreate({ sale }: Props) {
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = React.useState('');
    const [items, setItems] = React.useState(sale.items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })));

    const updateItem = (idx: number, field: string, value: string | number) => {
        const newItems = [...items];
        (newItems[idx] as Record<string, unknown>)[field] = value;
        setItems(newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/packing-slips', { sale_id: sale.id, date, notes, items });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Packing Slips', href: '/packing-slips' }, { title: 'Create', href: '/packing-slips/create' }]}>
            <Head title="Create Packing Slip" />
            <div className="p-4 max-w-3xl">
                <h1 className="text-lg font-semibold mb-4">Packing Slip for — {sale.invoice_no}</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Notes</label><input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th></tr></thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-3 py-2">{sale.items[idx]?.product.name}</td>
                                        <td className="px-3 py-2 text-right"><input type="number" step="0.01" min="0.01" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/packing-slips')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

import React from 'react';
