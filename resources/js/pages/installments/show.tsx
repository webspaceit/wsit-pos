import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Plan { id: number; reference_no: string; total_amount: number; down_payment: number; installment_amount: number; total_installments: number; paid_installments: number; frequency: string; status: string; start_date: string; notes: string; customer: { name: string }; sale: { invoice_no: string }; user: { name: string }; payments: Array<{ installment_number: number; amount: number; penalty: number; running_balance: number; due_date: string; paid_date: string | null; status: string; payment_method: string; user: { name: string } }>; }
interface Props { plan: Plan; }

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700' };
const planStatusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', defaulted: 'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-700' };

export default function InstallmentShow({ plan: p }: Props) {
    const payInstallment = (paymentId: number) => {
        const method = prompt('Payment method (cash/card/bkash/nagad/rocket):', 'cash');
        if (method) {
            router.post(`/installments/${paymentId}/pay`, { payment_method: method });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Installments', href: '/installments' }, { title: p.reference_no, href: `/installments/${p.id}` }]}>
            <Head title={`Installment ${p.reference_no}`} />
            <div className="p-4 max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Installment — {p.reference_no}</h1>
                    <button onClick={() => router.get('/installments')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-3 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Customer:</span> {p.customer.name}</div>
                    <div><span className="text-muted-foreground">Sale:</span> {p.sale.invoice_no}</div>
                    <div><span className="text-muted-foreground">Status:</span> <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${planStatusColors[p.status]}`}>{p.status}</span></div>
                    <div><span className="text-muted-foreground">Total:</span> {formatCurrency(p.total_amount)}</div>
                    <div><span className="text-muted-foreground">Down Payment:</span> {formatCurrency(p.down_payment)}</div>
                    <div><span className="text-muted-foreground">Installment:</span> {formatCurrency(p.installment_amount)} ({p.frequency})</div>
                    <div><span className="text-muted-foreground">Progress:</span> {p.paid_installments}/{p.total_installments} paid</div>
                    <div><span className="text-muted-foreground">Start Date:</span> {formatDate(p.start_date)}</div>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-center">#</th><th className="px-3 py-2 text-right">Amount</th>
                            <th className="px-3 py-2 text-right">Penalty</th><th className="px-3 py-2 text-right">Balance</th>
                            <th className="px-3 py-2 text-left">Due Date</th><th className="px-3 py-2 text-left">Paid Date</th>
                            <th className="px-3 py-2 text-center">Status</th><th className="px-3 py-2 text-right">Action</th>
                        </tr></thead>
                        <tbody>
                            {p.payments.map((pay) => (
                                <tr key={pay.installment_number} className="border-t">
                                    <td className="px-3 py-2 text-center">{pay.installment_number}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(pay.amount)}</td>
                                    <td className="px-3 py-2 text-right text-red-600">{pay.penalty > 0 ? formatCurrency(pay.penalty) : '-'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(pay.running_balance)}</td>
                                    <td className="px-3 py-2">{formatDate(pay.due_date)}</td>
                                    <td className="px-3 py-2">{pay.paid_date ? formatDate(pay.paid_date) : '-'}</td>
                                    <td className="px-3 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[pay.status]}`}>{pay.status}</span></td>
                                    <td className="px-3 py-2 text-right">
                                        {pay.status === 'pending' && <button onClick={() => payInstallment(pay.installment_number)} className="text-green-600 hover:underline text-xs">Pay</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
