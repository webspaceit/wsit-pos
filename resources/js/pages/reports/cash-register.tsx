import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface MethodRow { payment_method: string; count: number; total: number; }
interface Props { salesIn: number; expensesOut: number; incomeIn: number; netCash: number; allSalesByMethod: MethodRow[]; allExpensesByMethod: MethodRow[]; date: string }

const METHOD_LABELS: Record<string, string> = { cash: 'Cash', card: 'Card', bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', bank_transfer: 'Bank Transfer', cheque: 'Cheque', other: 'Other' };

export default function CashRegister({ salesIn, expensesOut, incomeIn, netCash, allSalesByMethod, allExpensesByMethod, date }: Props) {
    const [d, setD] = useState(date);

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Cash Register', href: '/reports/cash-register' }]}>
            <Head title="Cash Register" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Cash Register — {formatDate(date)}</h2>
                    <div className="flex items-center gap-3">
                        <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/reports/cash-register', { date: d }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border p-4 text-center bg-green-50">
                        <p className="text-sm text-muted-foreground">Cash Sales In</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(salesIn)}</p>
                    </div>
                    <div className="rounded-xl border p-4 text-center bg-blue-50">
                        <p className="text-sm text-muted-foreground">Other Income In</p>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(incomeIn)}</p>
                    </div>
                    <div className="rounded-xl border p-4 text-center bg-red-50">
                        <p className="text-sm text-muted-foreground">Cash Expenses Out</p>
                        <p className="text-xl font-bold text-red-600">{formatCurrency(expensesOut)}</p>
                    </div>
                    <div className={`rounded-xl border p-4 text-center ${netCash >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className="text-sm text-muted-foreground">Net Cash</p>
                        <p className={`text-xl font-bold ${netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netCash)}</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-muted px-4 py-2 font-semibold text-sm">All Sales by Method</div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr>
                                <th className="px-3 py-2 text-left">Method</th><th className="px-3 py-2 text-right">Count</th>
                                <th className="px-3 py-2 text-right">Total</th>
                            </tr></thead>
                            <tbody>
                                {allSalesByMethod.map((r) => (
                                    <tr key={r.payment_method} className="border-t">
                                        <td className="px-3 py-2 capitalize">{METHOD_LABELS[r.payment_method] || r.payment_method}</td>
                                        <td className="px-3 py-2 text-right">{r.count}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(r.total)}</td>
                                    </tr>
                                ))}
                                {allSalesByMethod.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">No sales</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-muted px-4 py-2 font-semibold text-sm">All Expenses by Method</div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr>
                                <th className="px-3 py-2 text-left">Method</th><th className="px-3 py-2 text-right">Count</th>
                                <th className="px-3 py-2 text-right">Total</th>
                            </tr></thead>
                            <tbody>
                                {allExpensesByMethod.map((r) => (
                                    <tr key={r.payment_method} className="border-t">
                                        <td className="px-3 py-2 capitalize">{METHOD_LABELS[r.payment_method] || r.payment_method}</td>
                                        <td className="px-3 py-2 text-right">{r.count}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(r.total)}</td>
                                    </tr>
                                ))}
                                {allExpensesByMethod.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">No expenses</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
