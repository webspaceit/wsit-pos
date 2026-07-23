import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Return { id: number; reference_no: string; date: string; grand_total: number; payment_method: string; status: string; reason: string; notes: string; sale: { invoice_no: string }; customer: { name: string } | null; user: { name: string }; items: Array<{ product: { name: string }; quantity: number; unit_price: number; tax_amount: number; total: number }>; }
interface Props { return_data: Return; }

export default function SaleReturnShow({ return_data: r }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Sale Returns', href: '/sale-returns' }, { title: r.reference_no, href: `/sale-returns/${r.id}` }]}>
            <Head title={`Sale Return ${r.reference_no}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Sale Return — {r.reference_no}</h1>
                    <button onClick={() => router.get('/sale-returns')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Invoice:</span> {r.sale.invoice_no}</div>
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(r.date)}</div>
                    <div><span className="text-muted-foreground">Customer:</span> {r.customer?.name || '-'}</div>
                    <div><span className="text-muted-foreground">Payment:</span> {r.payment_method}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{r.status}</span></div>
                    <div><span className="text-muted-foreground">Total:</span> <span className="text-red-600 font-medium">{formatCurrency(r.grand_total)}</span></div>
                    {r.reason && <div className="col-span-2"><span className="text-muted-foreground">Reason:</span> {r.reason}</div>}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Unit Price</th><th className="px-3 py-2 text-right">Total</th>
                        </tr></thead>
                        <tbody>
                            {r.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{item.product.name}</td>
                                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
