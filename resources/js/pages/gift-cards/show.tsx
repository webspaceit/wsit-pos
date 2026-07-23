import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface GiftCard { id: number; code: string; initial_amount: number; current_balance: number; status: string; issued_date: string; expiry_date: string | null; notes: string; customer: { name: string } | null; user: { name: string }; transactions: Array<{ amount: number; type: string; balance_after: number; created_at: string; user: { name: string } }>; }
interface Props { giftCard: GiftCard; }

export default function GiftCardShow({ giftCard: gc }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Gift Cards', href: '/gift-cards' }, { title: gc.code, href: `/gift-cards/${gc.id}` }]}>
            <Head title={`Gift Card ${gc.code}`} />
            <div className="p-4 max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Gift Card — {gc.code}</h1>
                    <button onClick={() => router.get('/gift-cards')} className="rounded-md border px-4 py-2 text-sm">Back</button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm">
                    <div><span className="text-muted-foreground">Code:</span> <span className="font-mono">{gc.code}</span></div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{gc.status}</span></div>
                    <div><span className="text-muted-foreground">Initial:</span> {formatCurrency(gc.initial_amount)}</div>
                    <div><span className="text-muted-foreground">Balance:</span> <span className="font-bold text-brand">{formatCurrency(gc.current_balance)}</span></div>
                    <div><span className="text-muted-foreground">Issued:</span> {formatDate(gc.issued_date)}</div>
                    <div><span className="text-muted-foreground">Expiry:</span> {gc.expiry_date ? formatDate(gc.expiry_date) : 'Never'}</div>
                </div>
                <h3 className="text-sm font-semibold">Transactions</h3>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-center">Type</th>
                            <th className="px-3 py-2 text-right">Amount</th><th className="px-3 py-2 text-right">Balance After</th>
                        </tr></thead>
                        <tbody>
                            {gc.transactions.map((t, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{formatDate(t.created_at)}</td>
                                    <td className="px-3 py-2 text-center capitalize">{t.type}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(t.amount)}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(t.balance_after)}</td>
                                </tr>
                            ))}
                            {gc.transactions.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">No transactions</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
