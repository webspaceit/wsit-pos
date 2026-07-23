import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Slip { id: number; reference_no: string; date: string; status: string; sale: { invoice_no: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number }>; }
interface Paginated { data: Slip[]; current_page: number; last_page: number; total: number; }
interface Props { packingSlips: Paginated; }

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', packed: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700' };

export default function PackingSlipsIndex({ packingSlips }: Props) {
    const updateStatus = (id: number, status: string) => { router.patch(`/packing-slips/${id}`, { status }); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Packing Slips', href: '/packing-slips' }]}>
            <Head title="Packing Slips" />
            <div className="p-4 space-y-4">
                <h1 className="text-lg font-semibold">Packing Slips</h1>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Sale</th><th className="px-3 py-2 text-center">Items</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {packingSlips.data.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{s.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(s.date)}</td>
                                    <td className="px-3 py-2">{s.sale.invoice_no}</td>
                                    <td className="px-3 py-2 text-center">{s.items.length}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[s.status]}`}>{s.status}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/packing-slips/${s.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        {s.status === 'pending' && <button onClick={() => updateStatus(s.id, 'packed')} className="text-green-600 hover:underline text-xs">Pack</button>}
                                        {s.status === 'packed' && <button onClick={() => updateStatus(s.id, 'shipped')} className="text-purple-600 hover:underline text-xs">Ship</button>}
                                        {s.status === 'shipped' && <button onClick={() => updateStatus(s.id, 'delivered')} className="text-green-600 hover:underline text-xs">Deliver</button>}
                                    </td>
                                </tr>
                            ))}
                            {packingSlips.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No packing slips</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
