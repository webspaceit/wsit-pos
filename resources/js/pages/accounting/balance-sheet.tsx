import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface AccountLine { account_code: string; name: string; type: string; balance: number; }
interface Props { assets: AccountLine[]; liabilities: AccountLine[]; equity: AccountLine[]; revenue: AccountLine[]; expenses: AccountLine[]; totalAssets: number; totalLiabilities: number; totalEquity: number; netIncome: number; asOf: string }

export default function BalanceSheet({ assets, liabilities, equity, revenue, expenses, totalAssets, totalLiabilities, totalEquity, netIncome, asOf }: Props) {
    const [date, setDate] = useState(asOf);
    const totalLiabAndEquity = totalLiabilities + totalEquity + netIncome;

    return (
        <AppLayout breadcrumbs={[{ title: 'Balance Sheet', href: '/accounting/balance-sheet' }]}>
            <Head title="Balance Sheet" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Balance Sheet</h1>
                    <div className="flex items-center gap-2">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/accounting/balance-sheet', { date })} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Filter</button>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">As of {date}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="bg-blue-50 px-4 py-2 font-semibold text-sm text-blue-800">Assets</div>
                            <table className="w-full text-sm">
                                <tbody>
                                    {assets.map((a, i) => (
                                        <tr key={i} className="border-t"><td className="px-4 py-2">{a.account_code} - {a.name}</td><td className="px-4 py-2 text-right">{formatCurrency(a.balance)}</td></tr>
                                    ))}
                                    {assets.length === 0 && <tr><td colSpan={2} className="px-4 py-2 text-muted-foreground">None</td></tr>}
                                </tbody>
                                <tfoot><tr className="border-t-2 font-bold bg-muted/30"><td className="px-4 py-2">Total Assets</td><td className="px-4 py-2 text-right">{formatCurrency(totalAssets)}</td></tr></tfoot>
                            </table>
                        </div>
                        <div className="rounded-xl border overflow-hidden">
                            <div className="bg-red-50 px-4 py-2 font-semibold text-sm text-red-800">Liabilities</div>
                            <table className="w-full text-sm">
                                <tbody>
                                    {liabilities.map((a, i) => (
                                        <tr key={i} className="border-t"><td className="px-4 py-2">{a.account_code} - {a.name}</td><td className="px-4 py-2 text-right">{formatCurrency(a.balance)}</td></tr>
                                    ))}
                                    {liabilities.length === 0 && <tr><td colSpan={2} className="px-4 py-2 text-muted-foreground">None</td></tr>}
                                </tbody>
                                <tfoot><tr className="border-t-2 font-bold bg-muted/30"><td className="px-4 py-2">Total Liabilities</td><td className="px-4 py-2 text-right">{formatCurrency(totalLiabilities)}</td></tr></tfoot>
                            </table>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="bg-purple-50 px-4 py-2 font-semibold text-sm text-purple-800">Equity</div>
                            <table className="w-full text-sm">
                                <tbody>
                                    {equity.map((a, i) => (
                                        <tr key={i} className="border-t"><td className="px-4 py-2">{a.account_code} - {a.name}</td><td className="px-4 py-2 text-right">{formatCurrency(a.balance)}</td></tr>
                                    ))}
                                    <tr className="border-t"><td className="px-4 py-2">Net Income</td><td className="px-4 py-2 text-right">{formatCurrency(netIncome)}</td></tr>
                                </tbody>
                                <tfoot><tr className="border-t-2 font-bold bg-muted/30"><td className="px-4 py-2">Total Equity + Net Income</td><td className="px-4 py-2 text-right">{formatCurrency(totalLiabAndEquity)}</td></tr></tfoot>
                            </table>
                        </div>
                        <div className={`rounded-xl border p-4 text-center ${Math.abs(totalAssets - totalLiabAndEquity) < 0.01 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <p className="text-sm font-medium">{Math.abs(totalAssets - totalLiabAndEquity) < 0.01 ? 'Balance Sheet is Balanced' : 'Balance Sheet is NOT Balanced'}</p>
                            <p className="text-xs text-muted-foreground mt-1">Difference: {formatCurrency(Math.abs(totalAssets - totalLiabAndEquity))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
