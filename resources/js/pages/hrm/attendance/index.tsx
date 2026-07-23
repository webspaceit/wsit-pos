import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HRM', href: '/hrm/employees' },
    { title: 'Attendance', href: '/hrm/attendance' },
];

const statusColors: Record<string, string> = { present: 'bg-emerald-100 text-emerald-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700', half_day: 'bg-orange-100 text-orange-700', holiday: 'bg-blue-100 text-blue-700' };

export default function Attendance({ attendances, employees, filters }: { attendances: { data: any[]; links: any[] }; employees: any[]; filters: any }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '', date: new Date().toISOString().split('T')[0], clock_in: '', clock_out: '', status: 'present', hours_worked: '', notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/hrm/attendance', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Attendance</h1>
                    <button onClick={() => { reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Record Attendance</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">Record Attendance</h2>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                            <div><label className="block text-sm font-medium">Employee *</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}><option value="">Select</option>{employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>{errors.employee_id && <p className="text-xs text-red-500">{errors.employee_id}</p>}</div>
                            <div><label className="block text-sm font-medium">Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.date} onChange={e => setData('date', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Status</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.status} onChange={e => setData('status', e.target.value)}><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option><option value="half_day">Half Day</option><option value="holiday">Holiday</option></select></div>
                            <div><label className="block text-sm font-medium">Hours Worked</label><input type="number" step="0.5" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.hours_worked} onChange={e => setData('hours_worked', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Clock In</label><input type="time" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.clock_in} onChange={e => setData('clock_in', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Clock Out</label><input type="time" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.clock_out} onChange={e => setData('clock_out', e.target.value)} /></div>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Save</button>
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Employee</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Clock In</th><th className="px-4 py-3 text-left">Clock Out</th><th className="px-4 py-3 text-left">Hours</th></tr></thead>
                        <tbody>
                            {attendances.data.map(a => (
                                <tr key={a.id} className="border-t"><td className="px-4 py-3">{a.date}</td><td className="px-4 py-3">{a.employee?.name}</td><td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[a.status] || ''}`}>{a.status}</span></td><td className="px-4 py-3">{a.clock_in || '-'}</td><td className="px-4 py-3">{a.clock_out || '-'}</td><td className="px-4 py-3">{a.hours_worked}</td></tr>
                            ))}
                            {!attendances.data.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No records</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
