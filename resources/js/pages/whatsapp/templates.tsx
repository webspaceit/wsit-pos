import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'WhatsApp', href: '/whatsapp' },
    { title: 'Templates', href: '/whatsapp/templates' },
];

export default function WhatsAppTemplates({ templates }: { templates: { data: any[]; links: any[] } }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const { data, setData, post, processing, reset } = useForm({
        name: '', category: 'custom', language: 'en', body: '', variables: [] as string[], is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/whatsapp/templates/${editItem.id}` : '/whatsapp/templates';
        post(url, { onSuccess: () => { reset(); setShowCreate(false); setEditItem(null); } });
    };

    const openEdit = (t: any) => {
        setEditItem(t);
        setData({ name: t.name, category: t.category, language: t.language, body: t.body, variables: t.variables || [], is_active: t.is_active });
        setShowCreate(true);
    };

    const categoryColors: Record<string, string> = { invoice: 'bg-blue-100 text-blue-700', due: 'bg-orange-100 text-orange-700', order: 'bg-emerald-100 text-emerald-700', custom: 'bg-gray-100 text-gray-700' };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="WhatsApp Templates" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Message Templates</h1>
                    <button onClick={() => { setEditItem(null); reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Add Template</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">{editItem ? 'Edit Template' : 'New Template'}</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="block text-sm font-medium">Name *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.name} onChange={e => setData('name', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium">Category</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.category} onChange={e => setData('category', e.target.value)}><option value="invoice">Invoice</option><option value="due">Due Reminder</option><option value="order">Order</option><option value="custom">Custom</option></select></div>
                                <div><label className="block text-sm font-medium">Language</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.language} onChange={e => setData('language', e.target.value)} /></div>
                            </div>
                            <div><label className="block text-sm font-medium">Body * (use {'{{variable}}'} for dynamic content)</label><textarea rows={5} className="mt-1 w-full rounded border px-3 py-2 text-sm font-mono" value={data.body} onChange={e => setData('body', e.target.value)} /></div>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} /> Active</label>
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Save</button>
                                <button type="button" onClick={() => { setShowCreate(false); setEditItem(null); }} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Language</th><th className="px-4 py-3 text-left">Preview</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                        <tbody>
                            {templates.data.map((t: any) => (
                                <tr key={t.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{t.name}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[t.category] || ''}`}>{t.category}</span></td>
                                    <td className="px-4 py-3">{t.language}</td>
                                    <td className="px-4 py-3 max-w-xs truncate font-mono text-xs">{t.body}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${t.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{t.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => openEdit(t)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button>
                                        <button onClick={() => router.delete(`/whatsapp/templates/${t.id}`)} className="text-red-600 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {!templates.data.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No templates</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
