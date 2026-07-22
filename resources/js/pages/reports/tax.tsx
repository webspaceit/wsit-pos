import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface TaxByProduct { name: string; tax_amount: number; total: number; }
interface Props { salesTax: number; purchaseTax: number; netTax: number; taxByProduct: TaxByProduct[]; from: string; to: string; }

export default function TaxReport({ salesTax, purchaseTax, netTax, taxByProduct, from, to }: Props) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);
    const filter = () => router.get('/reports/tax', { from: f, to: t }, { preserveState: true });

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Tax', href: '/reports/tax' }]}>
            <Head title="Tax Report" />
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Tax Report</h2>
                <div className="flex items-center gap-3">
                    <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <input type="date" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
                    <button onClick={filter} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Sales Tax Collected</p><p className="text-lg font-bold text-blue-600">{formatCurrency(salesTax)}</p></div>
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Purchase Tax Paid</p><p className="text-lg font-bold text-orange-600">{formatCurrency(purchaseTax)}</p></div>
                    <div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Net Tax</p><p className="text-lg font-bold">{formatCurrency(netTax)}</p></div>
                </div>
                <div className="rounded-xl border p-4">
                    <h3 className="font-semibold mb-3">Tax by Product</h3>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b text-muted-foreground"><th className="pb-2 text-left">Product</th><th className="pb-2 text-right">Total Sales</th><th className="pb-2 text-right">Tax Amount</th></tr></thead>
                        <tbody>
                            {taxByProduct.map((p, i) => (
                                <tr key={i} className="border-b last:border-0"><td className="py-1.5">{p.name}</td><td className="py-1.5 text-right">{formatCurrency(p.total)}</td><td className="py-1.5 text-right">{formatCurrency(p.tax_amount)}</td></tr>
                            ))}
                            {taxByProduct.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-muted-foreground">No tax data</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
