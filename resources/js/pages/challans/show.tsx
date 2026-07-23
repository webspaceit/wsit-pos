import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Challan { id: number; reference_no: string; invoice_no: string; date: string; status: string; delivery_address: string; driver_name: string; vehicle_no: string; notes: string; customer: { name: string } | null; sale: { invoice_no: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number }>; }
interface Props { challan: Challan; }

export default function ChallanShow({ challan: c }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Challans', href: '/challans' }, { title: c.reference_no, href: `/challans/${c.id}` }]}>
            <Head title={`Challan ${c.reference_no}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Challan — {c.reference_no}</h1>
                    <button onClick={() => router.get('/challans')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Invoice:</span> {c.invoice_no}</div>
                    <div><span className="text-muted-foreground">Date:</span> {formatDate(c.date)}</div>
                    <div><span className="text-muted-foreground">Customer:</span> {c.customer?.name || '-'}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{c.status}</span></div>
                    <div><span className="text-muted-foreground">Driver:</span> {c.driver_name || '-'}</div>
                    <div><span className="text-muted-foreground">Vehicle:</span> {c.vehicle_no || '-'}</div>
                    {c.delivery_address && <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {c.delivery_address}</div>}
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Quantity</th></tr></thead>
                        <tbody>
                            {c.items.map((item, idx) => (
                                <tr key={idx} className="border-t"><td className="px-3 py-2">{item.product.name}</td><td className="px-3 py-2 text-right">{item.quantity}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
