import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'WhatsApp', href: '/whatsapp' },
];

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', sent: 'bg-blue-100 text-blue-700', delivered: 'bg-emerald-100 text-emerald-700', read: 'bg-purple-100 text-purple-700', failed: 'bg-red-100 text-red-700' };
const typeColors: Record<string, string> = { invoice: 'bg-blue-100 text-blue-700', due_reminder: 'bg-orange-100 text-orange-700', order_confirmation: 'bg-emerald-100 text-emerald-700', delivery_update: 'bg-purple-100 text-purple-700', promotion: 'bg-pink-100 text-pink-700', custom: 'bg-gray-100 text-gray-700' };

export default function WhatsAppIndex({ logs, templates, stats, filters }: { logs: { data: any[]; links: any[] }; templates: any[]; stats: any; filters: any }) {
    const [showSend, setShowSend] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        recipient_phone: '', recipient_name: '', message: '', type: 'custom', template_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/whatsapp/send', { onSuccess: () => { reset(); setShowSend(false); } });
    };

    const applyTemplate = (templateId: string) => {
        const t = templates.find((tm: any) => String(tm.id) === templateId);
        if (t) { setData('message', t.body); setData('template_id', templateId); }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="WhatsApp Integration" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">WhatsApp Integration</h1>
                    <div className="flex gap-2">
                        <a href="/whatsapp/templates" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Templates</a>
                        <a href="/whatsapp/settings" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Settings</a>
                        <button onClick={() => { reset(); setShowSend(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Send Message</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-gray-500">Total Messages</p></div>
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold text-blue-600">{stats.sent}</p><p className="text-sm text-gray-500">Sent</p></div>
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{stats.delivered}</p><p className="text-sm text-gray-500">Delivered</p></div>
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold text-red-600">{stats.failed}</p><p className="text-sm text-gray-500">Failed</p></div>
                </div>

                {showSend && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">Send WhatsApp Message</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium">Recipient Phone *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" placeholder="+8801XXXXXXXXX" value={data.recipient_phone} onChange={e => setData('recipient_phone', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium">Recipient Name</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.recipient_name} onChange={e => setData('recipient_name', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium">Type</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.type} onChange={e => setData('type', e.target.value)}><option value="custom">Custom</option><option value="invoice">Invoice</option><option value="due_reminder">Due Reminder</option><option value="order_confirmation">Order Confirmation</option><option value="delivery_update">Delivery Update</option><option value="promotion">Promotion</option></select></div>
                                <div><label className="block text-sm font-medium">Template</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.template_id} onChange={e => applyTemplate(e.target.value)}><option value="">None</option>{templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                            </div>
                            <div><label className="block text-sm font-medium">Message *</label><textarea rows={5} className="mt-1 w-full rounded border px-3 py-2 text-sm font-mono" value={data.message} onChange={e => setData('message', e.target.value)} /></div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Send Message</button>
                                <button type="button" onClick={() => setShowSend(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Recipient</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Message</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Date</th></tr></thead>
                        <tbody>
                            {logs.data.map((log: any) => (
                                <tr key={log.id} className="border-t">
                                    <td className="px-4 py-3"><p className="font-medium">{log.recipient_name || 'Unknown'}</p><p className="text-xs text-gray-500">{log.recipient_phone}</p></td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[log.type] || ''}`}>{log.type.replace('_', ' ')}</span></td>
                                    <td className="px-4 py-3 max-w-xs truncate">{log.message}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[log.status] || ''}`}>{log.status}</span></td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{log.created_at}</td>
                                </tr>
                            ))}
                            {!logs.data.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No messages sent yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
