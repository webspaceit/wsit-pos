import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Challan { id: number; reference_no: string; invoice_no: string; date: string; status: string; delivery_address: string; driver_name: string; vehicle_no: string; customer: { name: string } | null; sale: { invoice_no: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number }>; }
interface Paginated { data: Challan[]; current_page: number; last_page: number; total: number; }
interface Props { challans: Paginated; }

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', dispatched: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', returned: 'bg-red-100 text-red-700' };

export default function ChallansIndex({ challans }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Challans', href: '/challans' }]}>
            <Head title="Challans" />
            <div className="p-4 space-y-4">
                <h1 className="text-lg font-semibold">Challans</h1>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Invoice</th>
                            <th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-left">Driver</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {challans.data.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{c.reference_no}</td>
                                    <td className="px-3 py-2">{c.invoice_no}</td>
                                    <td className="px-3 py-2">{c.customer?.name || '-'}</td>
                                    <td className="px-3 py-2">{c.driver_name || '-'}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[c.status]}`}>{c.status}</span></td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/challans/${c.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        {c.status === 'pending' && <button onClick={() => router.patch(`/challans/${c.id}`, { status: 'dispatched' })} className="text-purple-600 hover:underline text-xs">Dispatch</button>}
                                        {c.status === 'dispatched' && <button onClick={() => router.patch(`/challans/${c.id}`, { status: 'delivered' })} className="text-green-600 hover:underline text-xs">Deliver</button>}
                                    </td>
                                </tr>
                            ))}
                            {challans.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No challans</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
