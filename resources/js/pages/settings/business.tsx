import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props { settings: Record<string, string>; }

export default function BusinessSettings({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        business_name: settings.business_name || '',
        business_address: settings.business_address || '',
        business_phone: settings.business_phone || '',
        business_email: settings.business_email || '',
        tax_number: settings.tax_number || '',
        tax_rate: settings.tax_rate || '15',
        currency: settings.currency || 'BDT',
        currency_symbol: settings.currency_symbol || '৳',
        receipt_footer: settings.receipt_footer || '',
        invoice_prefix: settings.invoice_prefix || 'INV-',
        low_stock_threshold: settings.low_stock_threshold || '10',
        timezone: settings.timezone || 'Asia/Dhaka',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/business');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Settings', href: '/settings' }, { title: 'Business', href: '/settings/business' }]}>
            <Head title="Business Settings" />
            <div className="p-4 max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
                <form onSubmit={submit} className="space-y-4 rounded-xl border p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Business Name *" value={data.business_name} onChange={(v) => setData('business_name', v)} error={errors.business_name} />
                        <Field label="Business Phone" value={data.business_phone} onChange={(v) => setData('business_phone', v)} />
                        <Field label="Business Email" type="email" value={data.business_email} onChange={(v) => setData('business_email', v)} />
                        <Field label="Tax Number" value={data.tax_number} onChange={(v) => setData('tax_number', v)} />
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Business Address</label><textarea value={data.business_address} onChange={(e) => setData('business_address', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>

                    <h3 className="font-semibold border-t pt-4">Currency & Tax</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="Currency" value={data.currency} onChange={(v) => setData('currency', v)} />
                        <Field label="Currency Symbol" value={data.currency_symbol} onChange={(v) => setData('currency_symbol', v)} />
                        <Field label="Default Tax Rate (%)" type="number" value={data.tax_rate} onChange={(v) => setData('tax_rate', v)} />
                    </div>

                    <h3 className="font-semibold border-t pt-4">Invoice & Receipt</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Invoice Prefix" value={data.invoice_prefix} onChange={(v) => setData('invoice_prefix', v)} />
                        <Field label="Low Stock Threshold" type="number" value={data.low_stock_threshold} onChange={(v) => setData('low_stock_threshold', v)} />
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Receipt Footer</label><textarea value={data.receipt_footer} onChange={(e) => setData('receipt_footer', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>

                    <h3 className="font-semibold border-t pt-4">System</h3>
                    <Field label="Timezone" value={data.timezone} onChange={(v) => setData('timezone', v)} />

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={processing} className="rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{processing ? 'Saving...' : 'Save Settings'}</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
