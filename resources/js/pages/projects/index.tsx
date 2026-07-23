import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
];

const statusColors: Record<string, string> = {
    planning: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700', on_hold: 'bg-orange-100 text-orange-700',
    completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
};

export default function Projects({ projects, customers, branches, filters }: { projects: { data: any[]; links: any[] }; customers: any[]; branches: any[]; filters: any }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: '', branch_id: branches[0]?.id ? String(branches[0].id) : '', customer_id: '', description: '',
        budget: '0', start_date: '', end_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ New Project</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">New Project</h2>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                            <div><label className="block text-sm font-medium">Name *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.name} onChange={e => setData('name', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Budget (BDT)</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.budget} onChange={e => setData('budget', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Branch *</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.branch_id} onChange={e => setData('branch_id', e.target.value)}><option value="">Select</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium">Customer</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.customer_id} onChange={e => setData('customer_id', e.target.value)}><option value="">None</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div className="col-span-2"><label className="block text-sm font-medium">Description</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.description} onChange={e => setData('description', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Start Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.start_date} onChange={e => setData('start_date', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">End Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.end_date} onChange={e => setData('end_date', e.target.value)} /></div>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Create Project</button>
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Budget</th><th className="px-4 py-3 text-left">Progress</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Tasks</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                        <tbody>
                            {projects.data.map((p: any) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-4 py-3 font-mono text-sm">{p.code}</td>
                                    <td className="px-4 py-3 font-medium"><a href={`/projects/${p.id}`} className="hover:underline">{p.name}</a></td>
                                    <td className="px-4 py-3">{p.customer?.name || '-'}</td>
                                    <td className="px-4 py-3">৳{Number(p.budget).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                                            <span className="text-xs">{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[p.status] || ''}`}>{p.status.replace('_', ' ')}</span></td>
                                    <td className="px-4 py-3">{p.tasks?.length || 0}</td>
                                    <td className="px-4 py-3">
                                        <a href={`/projects/${p.id}`} className="text-blue-600 hover:underline text-sm mr-2">View</a>
                                        <button onClick={() => router.delete(`/projects/${p.id}`)} className="text-red-600 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {!projects.data.length && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No projects</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
