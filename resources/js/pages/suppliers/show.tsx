import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Props {
    supplier: { id: number; name: string; phone: string; email: string; address: string; city: string; company: string; tax_id: string; balance: number; notes: string; is_active: boolean; purchases: Array<{ id: number; reference_no: string; date: string; grand_total: number; paid_amount: number; due_amount: number; status: string }> };
    totalPurchases: number;
    totalDue: number;
}

export default function SupplierShow({ supplier, totalPurchases, totalDue }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Suppliers', href: '/suppliers' }, { title: supplier.name, href: `/suppliers/${supplier.id}` }]}>
            <Head title={supplier.name} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{supplier.name}</h2>
                    <Link href="/suppliers" className="text-sm text-blue-600 hover:underline">← Back to Suppliers</Link>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <InfoCard title="Contact" items={[{ label: 'Phone', value: supplier.phone || '-' }, { label: 'Email', value: supplier.email || '-' }, { label: 'Company', value: supplier.company || '-' }, { label: 'City', value: supplier.city || '-' }]} />
                    <InfoCard title="Financial" items={[{ label: 'Balance', value: formatCurrency(supplier.balance) }, { label: 'Total Purchases', value: formatCurrency(totalPurchases) }, { label: 'Total Due', value: formatCurrency(totalDue) }]} />
                    <InfoCard title="Other" items={[{ label: 'Tax ID', value: supplier.tax_id || '-' }, { label: 'Status', value: supplier.is_active ? 'Active' : 'Inactive' }, { label: 'Notes', value: supplier.notes || '-' }]} />
                </div>
                <div className="rounded-xl border p-4">
                    <h3 className="text-lg font-semibold mb-3">Recent Purchases</h3>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b text-left text-muted-foreground"><th className="pb-2">Date</th><th className="pb-2">Reference</th><th className="pb-2 text-right">Total</th><th className="pb-2 text-right">Paid</th><th className="pb-2 text-right">Due</th><th className="pb-2">Status</th></tr></thead>
                        <tbody>
                            {supplier.purchases.map((p) => (
                                <tr key={p.id} className="border-b last:border-0"><td className="py-2">{formatDate(p.date)}</td><td className="py-2"><Link href={`/purchases/${p.id}`} className="text-blue-600 hover:underline">{p.reference_no}</Link></td><td className="py-2 text-right">{formatCurrency(p.grand_total)}</td><td className="py-2 text-right">{formatCurrency(p.paid_amount)}</td><td className="py-2 text-right">{formatCurrency(p.due_amount)}</td><td className="py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></td></tr>
                            ))}
                            {supplier.purchases.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-muted-foreground">No purchases yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

function InfoCard({ title, items }: { title: string; items: { label: string; value: string }[] }) {
    return (
        <div className="rounded-xl border p-4">
            <h3 className="font-semibold mb-2">{title}</h3>
            <dl className="space-y-1 text-sm">{items.map((i) => <div key={i.label} className="flex justify-between"><dt className="text-muted-foreground">{i.label}</dt><dd className="font-medium">{i.value}</dd></div>)}</dl>
        </div>
    );
}
