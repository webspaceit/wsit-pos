import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Count { id: number; reference_no: string; date: string; status: string; notes: string; user: { name: string }; items: Array<{ product: { name: string }; system_quantity: number; counted_quantity: number; difference: number }>; }
interface Props { count: Count; }

export default function StockCountShow({ count: c }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Counts', href: '/stock-counts' }, { title: c.reference_no, href: `/stock-counts/${c.id}` }]}>
            <Head title={`Stock Count ${c.reference_no}`} />
            <div className="p-4 max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Stock Count — {c.reference_no}</h1>
                    <button onClick={() => router.get('/stock-counts')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(c.date)}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{c.status}</span></div>
                    <div><span className="text-muted-foreground">Counted by:</span> {c.user.name}</div>
                    {c.notes && <div><span className="text-muted-foreground">Notes:</span> {c.notes}</div>}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">System Qty</th>
                            <th className="px-3 py-2 text-right">Counted Qty</th><th className="px-3 py-2 text-right">Difference</th>
                        </tr></thead>
                        <tbody>
                            {c.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{item.product.name}</td>
                                    <td className="px-3 py-2 text-right">{item.system_quantity}</td>
                                    <td className="px-3 py-2 text-right">{item.counted_quantity}</td>
                                    <td className={`px-3 py-2 text-right font-medium ${item.difference > 0 ? 'text-green-600' : item.difference < 0 ? 'text-red-600' : ''}`}>{item.difference > 0 ? '+' : ''}{item.difference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
