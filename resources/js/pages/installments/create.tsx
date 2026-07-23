import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Sale { id: number; invoice_no: string; grand_total: number; customer: { name: string; id: number } | null; }
interface Customer { id: number; name: string; }
interface Props { sale: Sale; customers: Customer[]; }

export default function InstallmentCreate({ sale, customers }: Props) {
    const { data, setData, post, processing } = useForm({
        sale_id: sale.id, customer_id: sale.customer?.id ?? '',
        total_amount: sale.grand_total, down_payment: 0, installment_amount: Math.ceil(sale.grand_total / 6),
        total_installments: 6, interest_rate: 0, penalty_rate: 2,
        start_date: new Date().toISOString().split('T')[0], frequency: 'monthly', notes: '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); post('/installments', { onSuccess: () => router.get('/installments') }); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Installments', href: '/installments' }, { title: 'Create', href: '/installments/create' }]}>
            <Head title="Create Installment Plan" />
            <div className="p-4 max-w-2xl">
                <h1 className="text-lg font-semibold mb-4">New Installment Plan — {sale.invoice_no}</h1>
                <form onSubmit={submit} className="space-y-4 rounded-xl border p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Customer *</label><select value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required><option value="">Select</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Total Amount *</label><input type="number" step="0.01" value={data.total_amount} onChange={(e) => setData('total_amount', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Down Payment</label><input type="number" step="0.01" value={data.down_payment} onChange={(e) => setData('down_payment', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium mb-1">Installment Amount *</label><input type="number" step="0.01" value={data.installment_amount} onChange={(e) => setData('installment_amount', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Total Installments *</label><input type="number" min="1" value={data.total_installments} onChange={(e) => setData('total_installments', parseInt(e.target.value) || 1)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Frequency *</label><select value={data.frequency} onChange={(e) => setData('frequency', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="weekly">Weekly</option><option value="biweekly">Bi-weekly</option><option value="monthly">Monthly</option></select></div>
                        <div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Penalty Rate (%)</label><input type="number" step="0.01" value={data.penalty_rate} onChange={(e) => setData('penalty_rate', parseFloat(e.target.value) || 0)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/installments')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create Plan</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
