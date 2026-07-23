import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Quotation { id: number; reference_no: string; date: string; valid_until: string; grand_total: number; status: string; notes: string; customer: { name: string } | null; user: { name: string }; items: Array<{ product: { name: string }; quantity: number; unit_price: number; discount: number; tax_amount: number; total: number }>; }
interface Props { quotation: Quotation; }

const statusColors: Record<string, string> = { draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', converted: 'bg-purple-100 text-purple-700' };

export default function QuotationShow({ quotation: q }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Quotations', href: '/quotations' }, { title: q.reference_no, href: `/quotations/${q.id}` }]}>
            <Head title={`Quotation ${q.reference_no}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Quotation — {q.reference_no}</h1>
                    <div className="flex gap-2">
                        <button onClick={() => router.get('/quotations')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                        {q.status === 'draft' && <button onClick={() => router.put(`/quotations/${q.id}`, { status: 'sent' })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Mark Sent</button>}
                        {q.status === 'sent' && <>
                            <button onClick={() => router.put(`/quotations/${q.id}`, { status: 'accepted' })} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white">Accept</button>
                            <button onClick={() => router.put(`/quotations/${q.id}`, { status: 'rejected' })} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white">Reject</button>
                        </>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Customer:</span> {q.customer?.name || 'Walk-in'}</div>
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(q.date)}</div>
                    <div><span className="text-muted-foreground">Valid Until:</span> {q.valid_until ? formatDate(q.valid_until) : '-'}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[q.status] || ''}`}>{q.status}</span></div>
                    <div><span className="text-muted-foreground">Total:</span> <span className="font-bold">{formatCurrency(q.grand_total)}</span></div>
                    {q.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> {q.notes}</div>}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Price</th><th className="px-3 py-2 text-right">Disc.</th><th className="px-3 py-2 text-right">Total</th>
                        </tr></thead>
                        <tbody>
                            {q.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{item.product.name}</td>
                                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.discount)}</td>
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
