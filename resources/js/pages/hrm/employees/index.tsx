import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HRM', href: '/hrm/employees' },
    { title: 'Employees', href: '/hrm/employees' },
];

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    position: string;
    salary: number;
    status: string;
    join_date: string | null;
    branch: { id: number; name: string } | null;
}

export default function Employees({ employees, branches, filters }: { employees: { data: Employee[]; links: any[] }; branches: any[]; filters: any }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', phone: '', position: '', branch_id: '', salary: '', join_date: '', address: '', notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/hrm/employees', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    const statusColors: Record<string, string> = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-gray-100 text-gray-700', terminated: 'bg-red-100 text-red-700' };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Add Employee</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">New Employee</h2>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                            <div><label className="block text-sm font-medium">Name *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.name} onChange={e => setData('name', e.target.value)} />{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}</div>
                            <div><label className="block text-sm font-medium">Email *</label><input type="email" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.email} onChange={e => setData('email', e.target.value)} />{errors.email && <p className="text-xs text-red-500">{errors.email}</p>}</div>
                            <div><label className="block text-sm font-medium">Phone</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.phone} onChange={e => setData('phone', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Position *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.position} onChange={e => setData('position', e.target.value)} />{errors.position && <p className="text-xs text-red-500">{errors.position}</p>}</div>
                            <div><label className="block text-sm font-medium">Branch</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.branch_id} onChange={e => setData('branch_id', e.target.value)}><option value="">Select</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                            <div><label className="block text-sm font-medium">Monthly Salary (BDT) *</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.salary} onChange={e => setData('salary', e.target.value)} />{errors.salary && <p className="text-xs text-red-500">{errors.salary}</p>}</div>
                            <div><label className="block text-sm font-medium">Join Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.join_date} onChange={e => setData('join_date', e.target.value)} /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium">Address</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.address} onChange={e => setData('address', e.target.value)} /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium">Notes</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Save</button>
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Position</th><th className="px-4 py-3 text-left">Branch</th><th className="px-4 py-3 text-left">Salary</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                        <tbody>
                            {employees.data.map(e => (
                                <tr key={e.id} className="border-t">
                                    <td className="px-4 py-3"><Link href={`/hrm/employees/${e.id}`} className="font-medium hover:underline">{e.name}</Link><p className="text-xs text-gray-500">{e.email}</p></td>
                                    <td className="px-4 py-3">{e.position}</td>
                                    <td className="px-4 py-3">{e.branch?.name || '-'}</td>
                                    <td className="px-4 py-3">৳{Number(e.salary).toLocaleString()}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[e.status] || ''}`}>{e.status}</span></td>
                                    <td className="px-4 py-3"><Link href={`/hrm/employees/${e.id}`} className="text-blue-600 hover:underline">View</Link></td>
                                </tr>
                            ))}
                            {!employees.data.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No employees</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
