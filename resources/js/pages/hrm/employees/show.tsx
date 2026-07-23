import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HRM', href: '/hrm/employees' },
    { title: 'Employee', href: '#' },
];

const statusColors: Record<string, string> = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-gray-100 text-gray-700', terminated: 'bg-red-100 text-red-700' };

export default function EmployeeShow({ employee }: { employee: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employee.name} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{employee.name}</h1>
                    <div className="flex gap-2">
                        <Link href={`/hrm/attendance?employee_id=${employee.id}`} className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Attendance</Link>
                        <Link href="/hrm/employees" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Back</Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Info</h2>
                        <div className="space-y-1 text-sm"><p><span className="font-medium">Email:</span> {employee.email}</p><p><span className="font-medium">Phone:</span> {employee.phone || '-'}</p><p><span className="font-medium">Position:</span> {employee.position}</p><p><span className="font-medium">Branch:</span> {employee.branch?.name || '-'}</p><p><span className="font-medium">Status:</span> <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[employee.status] || ''}`}>{employee.status}</span></p></div>
                    </div>
                    <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Employment</h2>
                        <div className="space-y-1 text-sm"><p><span className="font-medium">Salary:</span> ৳{Number(employee.salary).toLocaleString()}</p><p><span className="font-medium">Join Date:</span> {employee.join_date || '-'}</p><p><span className="font-medium">End Date:</span> {employee.end_date || '-'}</p></div>
                    </div>
                    <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Address</h2><p className="text-sm">{employee.address || 'No address on file.'}</p></div>
                </div>
                {employee.notes && <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Notes</h2><p className="text-sm">{employee.notes}</p></div>}
                <div className="rounded-lg border bg-white">
                    <div className="px-4 py-3 font-semibold">Recent Attendance</div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Date</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Clock In</th><th className="px-4 py-2 text-left">Clock Out</th><th className="px-4 py-2 text-left">Hours</th></tr></thead>
                        <tbody>
                            {employee.attendances?.length ? employee.attendances.map((a: any) => (
                                <tr key={a.id} className="border-t"><td className="px-4 py-2">{a.date}</td><td className="px-4 py-2"><span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs">{a.status}</span></td><td className="px-4 py-2">{a.clock_in || '-'}</td><td className="px-4 py-2">{a.clock_out || '-'}</td><td className="px-4 py-2">{a.hours_worked}</td></tr>
                            )) : <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No attendance records</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
