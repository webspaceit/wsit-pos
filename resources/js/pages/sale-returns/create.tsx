import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, PAYMENT_METHODS } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; selling_price: number; tax_rate: number; tax_type: string; stock_quantity: number; }
interface SaleItem { id: number; product_id: number; quantity: number; unit_price: number; total: number; product: Product; }
interface Sale { id: number; invoice_no: string; date: string; customer: { name: string } | null; items: SaleItem[]; }
interface Props { sale: Sale; products: Product[]; }

export default function SaleReturnCreate({ sale, products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        sale_id: sale.id,
        customer_id: sale.customer?.name ? '' : '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        reason: '',
        notes: '',
        items: sale.items.map((item) => ({
            product_id: item.product_id,
            quantity: 1,
            unit_price: item.unit_price,
        })),
    });

    const updateItem = (index: number, field: string, value: string | number) => {
        const items = [...data.items];
        (items[index] as Record<string, unknown>)[field] = value;
        setData('items', items);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sale-returns', { onSuccess: () => router.get('/sale-returns') });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Sale Returns', href: '/sale-returns' }, { title: 'Create', href: '/sale-returns/create' }]}>
            <Head title="Create Sale Return" />
            <div className="p-4 max-w-3xl">
                <h1 className="text-lg font-semibold mb-4">Create Sale Return — {sale.invoice_no}</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Payment Method *</label>
                            <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Reason</label><input value={data.reason} onChange={(e) => setData('reason', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted"><tr>
                                <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Orig. Qty</th>
                                <th className="px-3 py-2 text-right">Return Qty</th><th className="px-3 py-2 text-right">Unit Price</th>
                            </tr></thead>
                            <tbody>
                                {data.items.map((item, idx) => {
                                    const product = products.find((p) => p.id === item.product_id);
                                    return (
                                        <tr key={idx} className="border-t">
                                            <td className="px-3 py-2">{product?.name || '-'}</td>
                                            <td className="px-3 py-2 text-right">{sale.items[idx]?.quantity}</td>
                                            <td className="px-3 py-2 text-right"><input type="number" step="0.01" min="0.01" max={sale.items[idx]?.quantity} value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-20 rounded border px-2 py-1 text-right text-sm" /></td>
                                            <td className="px-3 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/sale-returns')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create Return</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
