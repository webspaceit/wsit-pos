import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Repairs', href: '/repairs' },
];

const statusColors: Record<string, string> = {
    received: 'bg-blue-100 text-blue-700', diagnosed: 'bg-purple-100 text-purple-700', in_repair: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-emerald-100 text-emerald-700', delivered: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700',
};

export default function Repairs({ tickets, customers, branches, filters }: { tickets: { data: any[]; links: any[] }; customers: any[]; branches: any[]; filters: any }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        branch_id: branches[0]?.id ? String(branches[0].id) : '', customer_id: '', date: new Date().toISOString().split('T')[0],
        device_type: '', device_brand: '', device_model: '', serial_number: '', issue_description: '',
        estimated_cost: '0', advance_paid: '0', estimated_delivery: '', internal_notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/repairs', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repairs" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Repair Tickets</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ New Ticket</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">New Repair Ticket</h2>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                            <div><label className="block text-sm font-medium">Branch *</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.branch_id} onChange={e => setData('branch_id', e.target.value)}><option value="">Select</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium">Customer</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.customer_id} onChange={e => setData('customer_id', e.target.value)}><option value="">Walk-in</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium">Date *</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.date} onChange={e => setData('date', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Device Type *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.device_type} onChange={e => setData('device_type', e.target.value)} placeholder="e.g. Laptop, Phone" /></div>
                            <div><label className="block text-sm font-medium">Brand</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.device_brand} onChange={e => setData('device_brand', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Model</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.device_model} onChange={e => setData('device_model', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Serial Number</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Est. Delivery</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.estimated_delivery} onChange={e => setData('estimated_delivery', e.target.value)} /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium">Issue Description *</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.issue_description} onChange={e => setData('issue_description', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Estimated Cost</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.estimated_cost} onChange={e => setData('estimated_cost', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Advance Paid</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.advance_paid} onChange={e => setData('advance_paid', e.target.value)} /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium">Internal Notes</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.internal_notes} onChange={e => setData('internal_notes', e.target.value)} /></div>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Create Ticket</button>
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Ticket</th><th className="px-4 py-3 text-left">Device</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Est. Cost</th><th className="px-4 py-3 text-left">Balance</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                        <tbody>
                            {tickets.data.map((t: any) => (
                                <tr key={t.id} className="border-t">
                                    <td className="px-4 py-3"><a href={`/repairs/${t.id}`} className="font-mono text-sm font-medium hover:underline">{t.ticket_no}</a><p className="text-xs text-gray-500">{t.date}</p></td>
                                    <td className="px-4 py-3">{t.device_type}<p className="text-xs text-gray-500">{t.device_brand} {t.device_model}</p></td>
                                    <td className="px-4 py-3">{t.customer?.name || 'Walk-in'}</td>
                                    <td className="px-4 py-3">৳{Number(t.estimated_cost).toLocaleString()}</td>
                                    <td className={`px-4 py-3 ${Number(t.actual_cost - t.advance_paid) > 0 ? 'text-red-600' : ''}`}>৳{Number(t.actual_cost - t.advance_paid).toLocaleString()}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[t.status] || ''}`}>{t.status.replace('_', ' ')}</span></td>
                                    <td className="px-4 py-3"><a href={`/repairs/${t.id}`} className="text-blue-600 hover:underline text-sm">View</a></td>
                                </tr>
                            ))}
                            {!tickets.data.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No tickets</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
