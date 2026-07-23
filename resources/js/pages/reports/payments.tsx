import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface MethodRow { payment_method: string; count: number; total: number; }
interface Props { salePayments: MethodRow[]; purchasePayments: MethodRow[]; from: string; to: string }

const METHOD_LABELS: Record<string, string> = { cash: 'Cash', card: 'Card', bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', bank_transfer: 'Bank Transfer', cheque: 'Cheque', other: 'Other' };

export default function Payments({ salePayments, purchasePayments, from, to }: Props) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Payments', href: '/reports/payments' }]}>
            <Head title="Payment Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Payment Report</h2>
                <div className="flex items-center gap-3">
                    <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={() => router.get('/reports/payments', { from: f, to: t }, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-green-50 px-4 py-2 font-semibold text-sm text-green-800">Sale Payments Received</div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr>
                                <th className="px-3 py-2 text-left">Method</th><th className="px-3 py-2 text-right">Count</th>
                                <th className="px-3 py-2 text-right">Total</th>
                            </tr></thead>
                            <tbody>
                                {salePayments.map((r) => (
                                    <tr key={r.payment_method} className="border-t">
                                        <td className="px-3 py-2 capitalize">{METHOD_LABELS[r.payment_method] || r.payment_method}</td>
                                        <td className="px-3 py-2 text-right">{r.count}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(r.total)}</td>
                                    </tr>
                                ))}
                                {salePayments.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">No data</td></tr>}
                            </tbody>
                            <tfoot><tr className="border-t-2 font-bold bg-muted/50">
                                <td className="px-3 py-2">Total</td>
                                <td className="px-3 py-2 text-right">{salePayments.reduce((a, r) => a + r.count, 0)}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(salePayments.reduce((a, r) => a + r.total, 0))}</td>
                            </tr></tfoot>
                        </table>
                    </div>
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-red-50 px-4 py-2 font-semibold text-sm text-red-800">Purchase Payments Made</div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr>
                                <th className="px-3 py-2 text-left">Method</th><th className="px-3 py-2 text-right">Count</th>
                                <th className="px-3 py-2 text-right">Total</th>
                            </tr></thead>
                            <tbody>
                                {purchasePayments.map((r) => (
                                    <tr key={r.payment_method} className="border-t">
                                        <td className="px-3 py-2 capitalize">{METHOD_LABELS[r.payment_method] || r.payment_method}</td>
                                        <td className="px-3 py-2 text-right">{r.count}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(r.total)}</td>
                                    </tr>
                                ))}
                                {purchasePayments.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">No data</td></tr>}
                            </tbody>
                            <tfoot><tr className="border-t-2 font-bold bg-muted/50">
                                <td className="px-3 py-2">Total</td>
                                <td className="px-3 py-2 text-right">{purchasePayments.reduce((a, r) => a + r.count, 0)}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(purchasePayments.reduce((a, r) => a + r.total, 0))}</td>
                            </tr></tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
