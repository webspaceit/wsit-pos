import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface JournalEntry { id: number; reference_no: string; date: string; description: string; is_posted: boolean; user: { name: string }; lines: Array<{ account: { account_code: string; name: string }; debit: number; credit: number; description: string | null }>; }
interface Account { id: number; account_code: string; name: string; }
interface Paginated { data: JournalEntry[]; current_page: number; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }>; }
interface Props { entries: Paginated; accounts: Account[]; filters: { from?: string; to?: string; account_id?: string } }

export default function GeneralLedger({ entries, accounts, filters }: Props) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');
    const [accountId, setAccountId] = useState(filters.account_id || '');

    const applyFilter = () => {
        const params: Record<string, string> = {};
        if (from) params.from = from;
        if (to) params.to = to;
        if (accountId) params.account_id = accountId;
        router.get('/accounting/general-ledger', params, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'General Ledger', href: '/accounting/general-ledger' }]}>
            <Head title="General Ledger" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h1 className="text-lg font-semibold">General Ledger</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" className="rounded-md border px-3 py-2 text-sm" />
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" className="rounded-md border px-3 py-2 text-sm" />
                        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                            <option value="">All Accounts</option>
                            {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_code} - {a.name}</option>)}
                        </select>
                        <button onClick={applyFilter} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Filter</button>
                    </div>
                </div>
                {entries.data.map((entry) => (
                    <div key={entry.id} className="rounded-xl border overflow-hidden">
                        <div className="bg-muted px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="font-mono font-bold">{entry.reference_no}</span>
                                <span>{formatDate(entry.date)}</span>
                                <span className="text-muted-foreground">by {entry.user.name}</span>
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-xs ${entry.is_posted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{entry.is_posted ? 'Posted' : 'Draft'}</span>
                        </div>
                        <p className="px-4 py-1 text-sm text-muted-foreground">{entry.description}</p>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr>
                                <th className="px-4 py-1 text-left">Account</th><th className="px-4 py-1 text-left">Description</th>
                                <th className="px-4 py-1 text-right">Debit</th><th className="px-4 py-1 text-right">Credit</th>
                            </tr></thead>
                            <tbody>
                                {entry.lines.map((line, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="px-4 py-1 font-mono text-xs">{line.account.account_code} - {line.account.name}</td>
                                        <td className="px-4 py-1 text-muted-foreground">{line.description || '-'}</td>
                                        <td className="px-4 py-1 text-right">{line.debit > 0 ? formatCurrency(line.debit) : ''}</td>
                                        <td className="px-4 py-1 text-right">{line.credit > 0 ? formatCurrency(line.credit) : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                {entries.data.length === 0 && <p className="text-center text-muted-foreground py-8">No journal entries found.</p>}
                {entries.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {entries.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url)} className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-brand text-white' : 'bg-muted hover:bg-muted/80'}`}>{link.label}</button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
