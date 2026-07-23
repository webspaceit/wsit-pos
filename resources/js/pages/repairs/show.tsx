import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Repairs', href: '/repairs' },
    { title: 'Detail', href: '#' },
];

const statusColors: Record<string, string> = {
    received: 'bg-blue-100 text-blue-700', diagnosed: 'bg-purple-100 text-purple-700', in_repair: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-emerald-100 text-emerald-700', delivered: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700',
};

export default function RepairShow({ ticket }: { ticket: any }) {
    const { data, setData, put, processing } = useForm({
        status: ticket.status, actual_cost: String(ticket.actual_cost), advance_paid: String(ticket.advance_paid),
        technician_notes: ticket.technician_notes || '', internal_notes: ticket.internal_notes || '',
        actual_delivery: ticket.actual_delivery || '',
    });

    const update = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/repairs/${ticket.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Repair ${ticket.ticket_no}`} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{ticket.ticket_no}</h1>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[ticket.status] || ''}`}>{ticket.status.replace('_', ' ')}</span>
                    </div>
                    <Link href="/repairs" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Back</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Device</h2>
                        <div className="space-y-1 text-sm"><p><span className="font-medium">Type:</span> {ticket.device_type}</p><p><span className="font-medium">Brand:</span> {ticket.device_brand || '-'}</p><p><span className="font-medium">Model:</span> {ticket.device_model || '-'}</p><p><span className="font-medium">Serial:</span> {ticket.serial_number || '-'}</p></div>
                    </div>
                    <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Financial</h2>
                        <div className="space-y-1 text-sm"><p><span className="font-medium">Estimated:</span> ৳{Number(ticket.estimated_cost).toLocaleString()}</p><p><span className="font-medium">Actual:</span> ৳{Number(ticket.actual_cost).toLocaleString()}</p><p><span className="font-medium">Advance:</span> ৳{Number(ticket.advance_paid).toLocaleString()}</p><p className="font-semibold"><span className="font-medium">Balance:</span> <span className={Number(ticket.balance) > 0 ? 'text-red-600' : ''}>৳{Number(ticket.actual_cost - ticket.advance_paid).toLocaleString()}</span></p></div>
                    </div>
                    <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Customer</h2>
                        <div className="space-y-1 text-sm"><p><span className="font-medium">Name:</span> {ticket.customer?.name || 'Walk-in'}</p><p><span className="font-medium">Phone:</span> {ticket.customer?.phone || '-'}</p><p><span className="font-medium">Branch:</span> {ticket.branch?.name}</p><p><span className="font-medium">Received:</span> {ticket.date}</p></div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Issue</h2><p className="text-sm">{ticket.issue_description}</p></div>
                <div className="rounded-lg border bg-white p-4">
                    <h2 className="mb-3 font-semibold">Update Ticket</h2>
                    <form onSubmit={update} className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><label className="block text-sm font-medium">Status</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.status} onChange={e => setData('status', e.target.value)}><option value="received">Received</option><option value="diagnosed">Diagnosed</option><option value="in_repair">In Repair</option><option value="ready">Ready</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div>
                            <div><label className="block text-sm font-medium">Actual Cost</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.actual_cost} onChange={e => setData('actual_cost', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Advance Paid</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.advance_paid} onChange={e => setData('advance_paid', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Actual Delivery</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.actual_delivery} onChange={e => setData('actual_delivery', e.target.value)} /></div>
                        </div>
                        <div><label className="block text-sm font-medium">Technician Notes</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.technician_notes} onChange={e => setData('technician_notes', e.target.value)} /></div>
                        <div><label className="block text-sm font-medium">Internal Notes</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.internal_notes} onChange={e => setData('internal_notes', e.target.value)} /></div>
                        <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Update</button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
