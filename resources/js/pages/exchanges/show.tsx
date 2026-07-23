import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Exchange { id: number; reference_no: string; date: string; price_difference: number; payment_method: string; reason: string; notes: string; customer: { name: string } | null; sale: { invoice_no: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number; unit_price: number; total: number; direction: string }>; }
interface Props { exchange: Exchange; }

export default function ExchangeShow({ exchange: e }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Exchanges', href: '/exchanges' }, { title: e.reference_no, href: `/exchanges/${e.id}` }]}>
            <Head title={`Exchange ${e.reference_no}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Exchange — {e.reference_no}</h1>
                    <button onClick={() => router.get('/exchanges')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Sale:</span> {e.sale.invoice_no}</div>
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(e.date)}</div>
                    <div><span className="text-muted-foreground">Customer:</span> {e.customer?.name || '-'}</div>
                    <div><span className="text-muted-foreground">Price Diff:</span> <span className={`font-medium ${e.price_difference > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(e.price_difference)}</span></div>
                    {e.reason && <div className="col-span-2"><span className="text-muted-foreground">Reason:</span> {e.reason}</div>}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-center">Direction</th>
                            <th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Price</th><th className="px-3 py-2 text-right">Total</th>
                        </tr></thead>
                        <tbody>
                            {e.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{item.product.name}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs ${item.direction === 'returned' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{item.direction}</span></td>
                                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
