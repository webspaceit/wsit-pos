import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Transfer { id: number; reference_no: string; date: string; status: string; notes: string; from_branch: { name: string }; to_branch: { name: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number }>; }
interface Props { transfer: Transfer; }

export default function StockTransferShow({ transfer: t }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Transfers', href: '/stock-transfers' }, { title: t.reference_no, href: `/stock-transfers/${t.id}` }]}>
            <Head title={`Stock Transfer ${t.reference_no}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Stock Transfer — {t.reference_no}</h1>
                    <button onClick={() => router.get('/stock-transfers')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">From:</span> {t.from_branch.name}</div>
                    <div><span className="text-muted-foreground">To:</span> {t.to_branch.name}</div>
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(t.date)}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{t.status.replace('_', ' ')}</span></div>
                    {t.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> {t.notes}</div>}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Quantity</th>
                        </tr></thead>
                        <tbody>
                            {t.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{item.product.name}</td>
                                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
