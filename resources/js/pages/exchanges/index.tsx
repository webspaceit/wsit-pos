import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Exchange { id: number; reference_no: string; date: string; price_difference: number; payment_method: string; reason: string; customer: { name: string } | null; sale: { invoice_no: string }; user: { name: string }; items: Array<{ product: { name: string }; quantity: number; unit_price: number; total: number; direction: string }>; }
interface Paginated { data: Exchange[]; current_page: number; last_page: number; total: number; }
interface Props { exchanges: Paginated; }

export default function ExchangesIndex({ exchanges }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Exchanges', href: '/exchanges' }]}>
            <Head title="Exchanges" />
            <div className="p-4 space-y-4">
                <h1 className="text-lg font-semibold">Sale Exchanges</h1>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Ref No</th><th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Sale</th><th className="px-3 py-2 text-left">Customer</th>
                            <th className="px-3 py-2 text-right">Difference</th><th className="px-3 py-2 text-right">Actions</th>
                        </tr></thead>
                        <tbody>
                            {exchanges.data.map((e) => (
                                <tr key={e.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-mono text-xs">{e.reference_no}</td>
                                    <td className="px-3 py-2">{formatDate(e.date)}</td>
                                    <td className="px-3 py-2">{e.sale.invoice_no}</td>
                                    <td className="px-3 py-2">{e.customer?.name || '-'}</td>
                                    <td className={`px-3 py-2 text-right font-medium ${e.price_difference > 0 ? 'text-red-600' : e.price_difference < 0 ? 'text-green-600' : ''}`}>{e.price_difference > 0 ? '+' : ''}{formatCurrency(e.price_difference)}</td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => router.get(`/exchanges/${e.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                                        <button onClick={() => { if (confirm('Delete?')) router.delete(`/exchanges/${e.id}`); }} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {exchanges.data.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No exchanges</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
