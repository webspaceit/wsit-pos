import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Plan { id: number; reference_no: string; total_amount: number; down_payment: number; installment_amount: number; total_installments: number; paid_installments: number; frequency: string; status: string; start_date: string; customer: { name: string }; sale: { invoice_no: string }; user: { name: string }; }
interface Paginated { data: Plan[]; current_page: number; last_page: number; total: number; }
interface Props { plans: Paginated; }

const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', defaulted: 'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-700' };

export default function InstallmentsIndex({ plans }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Installments', href: '/installments' }]}>
            <Head title="Installments" />
            <div className="p-4 space-y-4">
                <h1 className="text-lg font-semibold">Installment Plans</h1>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Customer</th>
                            <th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-center">Progress</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {plans.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{p.reference_no}</td>
                                    <td className="px-3 py-2">{p.customer.name}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(p.total_amount)}</td>
                                    <td className="px-3 py-2 text-center"><span className="text-xs">{p.paid_installments}/{p.total_installments}</span></td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[p.status] || ''}`}>{p.status}</span></td>
                                    <td className="px-3 py-2 text-right"><button onClick={() => router.get(`/installments/${p.id}`)} className="text-blue-600 hover:underline text-xs">View</button></td>
                                </tr>
                            ))}
                            {plans.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No installment plans</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
