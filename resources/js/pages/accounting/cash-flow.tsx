import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Props { operatingIn: number; operatingOut: number; investingIn: number; investingOut: number; financingIn: number; financingOut: number; from: string; to: string }

export default function CashFlow({ operatingIn, operatingOut, investingIn, investingOut, financingIn, financingOut, from, to }: Props) {
    const [startDate, setStartDate] = useState(from);
    const [endDate, setEndDate] = useState(to);

    const netOperating = operatingIn - operatingOut;
    const netInvesting = investingIn - investingOut;
    const netFinancing = financingIn - financingOut;
    const netCashFlow = netOperating + netInvesting + netFinancing;

    return (
        <AppLayout breadcrumbs={[{ title: 'Cash Flow', href: '/accounting/cash-flow' }]}>
            <Head title="Cash Flow Statement" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Cash Flow Statement</h1>
                    <div className="flex items-center gap-2">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/accounting/cash-flow', { from: startDate, to: endDate })} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Filter</button>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">Period: {startDate} to {endDate}</p>
                <div className="max-w-xl space-y-4">
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-green-50 px-4 py-2 font-semibold text-sm text-green-800">Operating Activities</div>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-t"><td className="px-4 py-2">Cash Inflows</td><td className="px-4 py-2 text-right text-green-600">{formatCurrency(operatingIn)}</td></tr>
                                <tr className="border-t"><td className="px-4 py-2">Cash Outflows</td><td className="px-4 py-2 text-right text-red-600">({formatCurrency(operatingOut)})</td></tr>
                            </tbody>
                            <tfoot><tr className="border-t-2 font-bold bg-muted/30"><td className="px-4 py-2">Net Operating</td><td className={`px-4 py-2 text-right ${netOperating >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netOperating)}</td></tr></tfoot>
                        </table>
                    </div>
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-blue-50 px-4 py-2 font-semibold text-sm text-blue-800">Investing Activities</div>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-t"><td className="px-4 py-2">Cash Inflows</td><td className="px-4 py-2 text-right text-green-600">{formatCurrency(investingIn)}</td></tr>
                                <tr className="border-t"><td className="px-4 py-2">Cash Outflows</td><td className="px-4 py-2 text-right text-red-600">({formatCurrency(investingOut)})</td></tr>
                            </tbody>
                            <tfoot><tr className="border-t-2 font-bold bg-muted/30"><td className="px-4 py-2">Net Investing</td><td className={`px-4 py-2 text-right ${netInvesting >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netInvesting)}</td></tr></tfoot>
                        </table>
                    </div>
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-purple-50 px-4 py-2 font-semibold text-sm text-purple-800">Financing Activities</div>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-t"><td className="px-4 py-2">Cash Inflows</td><td className="px-4 py-2 text-right text-green-600">{formatCurrency(financingIn)}</td></tr>
                                <tr className="border-t"><td className="px-4 py-2">Cash Outflows</td><td className="px-4 py-2 text-right text-red-600">({formatCurrency(financingOut)})</td></tr>
                            </tbody>
                            <tfoot><tr className="border-t-2 font-bold bg-muted/30"><td className="px-4 py-2">Net Financing</td><td className={`px-4 py-2 text-right ${netFinancing >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netFinancing)}</td></tr></tfoot>
                        </table>
                    </div>
                    <div className={`rounded-xl border p-4 text-center ${netCashFlow >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="text-lg font-bold">{netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}</p>
                        <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
