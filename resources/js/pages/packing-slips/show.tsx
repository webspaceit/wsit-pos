import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Slip { id: number; reference_no: string; date: string; status: string; notes: string; sale: { invoice_no: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number }>; }
interface Props { packingSlip: Slip; }

export default function PackingSlipShow({ packingSlip: s }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Packing Slips', href: '/packing-slips' }, { title: s.reference_no, href: `/packing-slips/${s.id}` }]}>
            <Head title={`Packing Slip ${s.reference_no}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Packing Slip — {s.reference_no}</h1>
                    <button onClick={() => router.get('/packing-slips')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Sale:</span> {s.sale.invoice_no}</div>
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(s.date)}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{s.status}</span></div>
                    <div><span className="text-muted-foreground">Packed by:</span> {s.user.name}</div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Quantity</th></tr></thead>
                        <tbody>
                            {s.items.map((item, idx) => (
                                <tr key={idx} className="border-t"><td className="px-3 py-2">{item.product.name}</td><td className="px-3 py-2 text-right">{item.quantity}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
