import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Props {
    customer: { id: number; name: string; phone: string; email: string; address: string; city: string; tax_id: string; balance: number; credit_limit: number; notes: string; is_active: boolean; sales: Array<{ id: number; invoice_no: string; date: string; grand_total: number; paid_amount: number; due_amount: number; status: string; payment_method: string }> };
    totalSales: number;
    totalDue: number;
}

export default function CustomerShow({ customer, totalSales, totalDue }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Customers', href: '/customers' }, { title: customer.name, href: `/customers/${customer.id}` }]}>
            <Head title={customer.name} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{customer.name}</h2>
                    <Link href="/customers" className="text-sm text-blue-600 hover:underline">← Back to Customers</Link>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-2">Contact</h3>
                        <dl className="space-y-1 text-sm">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Phone</dt><dd>{customer.phone || '-'}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd>{customer.email || '-'}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">City</dt><dd>{customer.city || '-'}</dd></div>
                        </dl>
                    </div>
                    <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-2">Financial</h3>
                        <dl className="space-y-1 text-sm">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Balance</dt><dd className="font-bold">{formatCurrency(customer.balance)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Total Sales</dt><dd>{formatCurrency(totalSales)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Total Due</dt><dd className="text-red-600 font-bold">{formatCurrency(totalDue)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Credit Limit</dt><dd>{formatCurrency(customer.credit_limit)}</dd></div>
                        </dl>
                    </div>
                    <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-2">Other</h3>
                        <dl className="space-y-1 text-sm">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Tax ID</dt><dd>{customer.tax_id || '-'}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><span className={`rounded-full px-2 py-0.5 text-xs ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{customer.is_active ? 'Active' : 'Inactive'}</span></dd></div>
                        </dl>
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <h3 className="text-lg font-semibold mb-3">Recent Sales</h3>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b text-left text-muted-foreground"><th className="pb-2">Date</th><th className="pb-2">Invoice</th><th className="pb-2 text-right">Total</th><th className="pb-2 text-right">Paid</th><th className="pb-2 text-right">Due</th><th className="pb-2">Payment</th></tr></thead>
                        <tbody>
                            {customer.sales.map((s) => (
                                <tr key={s.id} className="border-b last:border-0">
                                    <td className="py-2">{formatDate(s.date)}</td>
                                    <td className="py-2"><Link href={`/sales/${s.id}`} className="text-blue-600 hover:underline">{s.invoice_no}</Link></td>
                                    <td className="py-2 text-right">{formatCurrency(s.grand_total)}</td>
                                    <td className="py-2 text-right">{formatCurrency(s.paid_amount)}</td>
                                    <td className="py-2 text-right">{formatCurrency(s.due_amount)}</td>
                                    <td className="py-2 capitalize">{s.payment_method}</td>
                                </tr>
                            ))}
                            {customer.sales.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-muted-foreground">No sales yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
