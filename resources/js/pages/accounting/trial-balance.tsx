import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface AccountLine { id: number; account_code: string; name: string; type: string; debit: number; credit: number; balance: number; }
interface Props { accounts: AccountLine[]; totalDebit: number; totalCredit: number; asOf: string }

export default function TrialBalance({ accounts, totalDebit, totalCredit, asOf }: Props) {
    const [date, setDate] = useState(asOf);

    return (
        <AppLayout breadcrumbs={[{ title: 'Trial Balance', href: '/accounting/trial-balance' }]}>
            <Head title="Trial Balance" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Trial Balance</h1>
                    <div className="flex items-center gap-2">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                        <button onClick={() => router.get('/accounting/trial-balance', { date })} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Filter</button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Account</th>
                            <th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-right">Debit</th>
                            <th className="px-3 py-2 text-right">Credit</th><th className="px-3 py-2 text-right">Balance</th>
                        </tr></thead>
                        <tbody>
                            {accounts.map((a) => (
                                <tr key={a.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs font-bold">{a.account_code}</td>
                                    <td className="px-3 py-2">{a.name}</td>
                                    <td className="px-3 py-2 capitalize text-muted-foreground">{a.type}</td>
                                    <td className="px-3 py-2 text-right">{a.debit > 0 ? formatCurrency(a.debit) : '-'}</td>
                                    <td className="px-3 py-2 text-right">{a.credit > 0 ? formatCurrency(a.credit) : '-'}</td>
                                    <td className={`px-3 py-2 text-right font-medium ${a.balance >= 0 ? '' : 'text-red-600'}`}>{formatCurrency(a.balance)}</td>
                                </tr>
                            ))}
                            <tr className="border-t-2 font-bold bg-muted/50">
                                <td colSpan={3} className="px-3 py-2">Total</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(totalDebit)}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(totalCredit)}</td>
                                <td className={`px-3 py-2 text-right ${Math.abs(totalDebit - totalCredit) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                                    {Math.abs(totalDebit - totalCredit) > 0.01 ? 'UNBALANCED' : 'Balanced'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
