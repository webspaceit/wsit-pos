import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HRM', href: '/hrm/employees' },
    { title: 'Salaries', href: '/hrm/salary' },
];

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-emerald-100 text-emerald-700', partial: 'bg-orange-100 text-orange-700' };

export default function Salary({ salaries, employees, filters }: { salaries: { data: any[]; links: any[] }; employees: any[]; filters: any }) {
    const [payTarget, setPayTarget] = useState<any>(null);
    const { data: genData, post: genPost, processing: genProcessing } = useForm({ month: filters.month || new Date().toISOString().slice(0, 7) });
    const { data: payData, setData: setPayData, post: payPost, processing: payProcessing } = useForm({ paid_amount: '', paid_date: new Date().toISOString().split('T')[0] });

    const generateSalaries = () => { genPost('/hrm/salary/generate'); };
    const paySalary = () => {
        if (!payTarget) return;
        payPost(`/hrm/salary/${payTarget.id}/pay`, { onSuccess: () => { setPayTarget(null); setPayData('paid_amount', ''); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Salaries" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Salary Management</h1>
                    <div className="flex gap-2 items-center">
                        <input type="month" defaultValue={genData.month} onChange={e => genData.month = e.target.value} className="rounded border px-3 py-2 text-sm" />
                        <button onClick={generateSalaries} disabled={genProcessing} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Generate Salaries</button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Employee</th><th className="px-4 py-3 text-left">Month</th><th className="px-4 py-3 text-left">Base</th><th className="px-4 py-3 text-left">Bonus</th><th className="px-4 py-3 text-left">Deductions</th><th className="px-4 py-3 text-left">Net</th><th className="px-4 py-3 text-left">Paid</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
                        <tbody>
                            {salaries.data.map((s: any) => (
                                <tr key={s.id} className="border-t">
                                    <td className="px-4 py-3">{s.employee?.name}</td>
                                    <td className="px-4 py-3">{s.month}</td>
                                    <td className="px-4 py-3">৳{Number(s.base_salary).toLocaleString()}</td>
                                    <td className="px-4 py-3">৳{Number(s.bonus).toLocaleString()}</td>
                                    <td className="px-4 py-3">৳{Number(s.deductions).toLocaleString()}</td>
                                    <td className="px-4 py-3">৳{Number(s.net_salary).toLocaleString()}</td>
                                    <td className="px-4 py-3">৳{Number(s.paid_amount).toLocaleString()}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[s.status] || ''}`}>{s.status}</span></td>
                                    <td className="px-4 py-3">{s.status !== 'paid' && <button onClick={() => setPayTarget(s)} className="rounded bg-blue-600 px-3 py-1 text-xs text-white">Pay</button>}</td>
                                </tr>
                            ))}
                            {!salaries.data.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No salary records</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {payTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-3 font-semibold">Record Payment - {payTarget.employee?.name}</h2>
                        <p className="mb-3 text-sm text-gray-600">Net Salary: ৳{Number(payTarget.net_salary).toLocaleString()}</p>
                        <div className="space-y-3">
                            <div><label className="block text-sm font-medium">Amount</label><input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={payData.paid_amount} onChange={e => setPayData('paid_amount', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={payData.paid_date} onChange={e => setPayData('paid_date', e.target.value)} /></div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={paySalary} disabled={payProcessing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Record Payment</button>
                            <button onClick={() => setPayTarget(null)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
