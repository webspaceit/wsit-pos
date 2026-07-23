import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Props { settings: Record<string, Record<string, string>> }

type Tab = 'barcode' | 'invoice' | 'pos' | 'mail' | 'sms';
const TABS: { key: Tab; label: string }[] = [
    { key: 'barcode', label: 'Barcode' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'pos', label: 'POS' },
    { key: 'mail', label: 'Mail (SMTP)' },
    { key: 'sms', label: 'SMS' },
];

export default function PosSettings({ settings }: Props) {
    const [tab, setTab] = useState<Tab>('barcode');
    const s = settings;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'POS Settings', href: '/pos-settings' }]}>
            <Head title="POS Settings" />
            <div className="p-4 max-w-3xl space-y-4">
                <h1 className="text-lg font-semibold">POS Settings</h1>
                <div className="flex gap-1 border-b">
                    {TABS.map((t) => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t.key ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t.label}</button>
                    ))}
                </div>
                {tab === 'barcode' && <BarcodeTab defaults={s.barcode} />}
                {tab === 'invoice' && <InvoiceTab defaults={s.invoice} />}
                {tab === 'pos' && <PosTab defaults={s.pos} />}
                {tab === 'mail' && <MailTab defaults={s.mail} />}
                {tab === 'sms' && <SmsTab defaults={s.sms} />}
            </div>
        </AppLayout>
    );
}

function BarcodeTab({ defaults }: { defaults: Record<string, string> }) {
    const { data, setData, post, processing } = useForm({ group: 'barcode', prefix: defaults.prefix || 'PRD', length: defaults.length || '13', type: defaults.type || 'EAN13' });
    const save = (e: React.FormEvent) => { e.preventDefault(); post('/pos-settings'); };

    return (
        <form onSubmit={save}>
            <section className="rounded-xl border p-6 space-y-4">
                <h3 className="font-semibold text-base border-b pb-2">Barcode Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Field label="Prefix" value={data.prefix} onChange={(v) => setData('prefix', v)} />
                    <Field label="Length" type="number" value={data.length} onChange={(v) => setData('length', v)} />
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                            {['EAN13', 'EAN8', 'UPC', 'Code128', 'Code39', 'QR'].map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                        {processing ? 'Saving...' : 'Save Barcode Settings'}
                    </button>
                </div>
            </section>
        </form>
    );
}

function InvoiceTab({ defaults }: { defaults: Record<string, string> }) {
    const { data, setData, post, processing } = useForm({
        group: 'invoice', prefix: defaults.prefix || 'INV-', next_number: defaults.next_number || '1001', terms: defaults.terms || '', header_text: defaults.header_text || '',
        show_tax: defaults.show_tax === '1' || defaults.show_tax === 'true', show_discount: defaults.show_discount === '1' || defaults.show_discount === 'true',
        show_customer: defaults.show_customer === '1' || defaults.show_customer === 'true',
    });
    const save = (e: React.FormEvent) => { e.preventDefault(); post('/pos-settings'); };

    return (
        <form onSubmit={save}>
            <section className="rounded-xl border p-6 space-y-4">
                <h3 className="font-semibold text-base border-b pb-2">Invoice Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Invoice Prefix" value={data.prefix} onChange={(v) => setData('prefix', v)} />
                    <Field label="Next Number" type="number" value={data.next_number} onChange={(v) => setData('next_number', v)} />
                </div>
                <Textarea label="Header Text" value={data.header_text} onChange={(v) => setData('header_text', v)} />
                <Textarea label="Terms & Conditions" value={data.terms} onChange={(v) => setData('terms', v)} />
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.show_tax} onChange={(e) => setData('show_tax', e.target.checked)} className="rounded" /> Show Tax</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.show_discount} onChange={(e) => setData('show_discount', e.target.checked)} className="rounded" /> Show Discount</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.show_customer} onChange={(e) => setData('show_customer', e.target.checked)} className="rounded" /> Show Customer</label>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                        {processing ? 'Saving...' : 'Save Invoice Settings'}
                    </button>
                </div>
            </section>
        </form>
    );
}

function PosTab({ defaults }: { defaults: Record<string, string> }) {
    const { data, setData, post, processing } = useForm({
        group: 'pos', default_payment_method: defaults.default_payment_method || 'cash', receipt_width: defaults.receipt_width || '80',
        auto_print: defaults.auto_print === '1' || defaults.auto_print === 'true', show_stock: defaults.show_stock === '1' || defaults.show_stock === 'true',
        allow_discount: defaults.allow_discount === '1' || defaults.allow_discount === 'true', allow_price_edit: defaults.allow_price_edit === '1' || defaults.allow_price_edit === 'true',
        theme: defaults.theme || 'light',
    });
    const save = (e: React.FormEvent) => { e.preventDefault(); post('/pos-settings'); };

    return (
        <form onSubmit={save}>
            <section className="rounded-xl border p-6 space-y-4">
                <h3 className="font-semibold text-base border-b pb-2">POS Terminal Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Default Payment Method</label>
                        <select value={data.default_payment_method} onChange={(e) => setData('default_payment_method', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                            {['cash', 'card', 'bkash', 'nagad', 'rocket'].map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Receipt Width</label>
                        <select value={data.receipt_width} onChange={(e) => setData('receipt_width', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                            <option value="58">58mm</option><option value="80">80mm</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Theme</label>
                        <select value={data.theme} onChange={(e) => setData('theme', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                            {['light', 'dark', 'auto'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.auto_print} onChange={(e) => setData('auto_print', e.target.checked)} className="rounded" /> Auto Print Receipt</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.show_stock} onChange={(e) => setData('show_stock', e.target.checked)} className="rounded" /> Show Stock on Terminal</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.allow_discount} onChange={(e) => setData('allow_discount', e.target.checked)} className="rounded" /> Allow Discount</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.allow_price_edit} onChange={(e) => setData('allow_price_edit', e.target.checked)} className="rounded" /> Allow Price Edit</label>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                        {processing ? 'Saving...' : 'Save POS Settings'}
                    </button>
                </div>
            </section>
        </form>
    );
}

function MailTab({ defaults }: { defaults: Record<string, string> }) {
    const { data, setData, post, processing } = useForm({
        group: 'mail', smtp_host: defaults.smtp_host || '', smtp_port: defaults.smtp_port || '587', smtp_username: defaults.smtp_username || '',
        smtp_password: defaults.smtp_password || '', smtp_encryption: defaults.smtp_encryption || 'tls', from_name: defaults.from_name || '', from_email: defaults.from_email || '',
    });
    const save = (e: React.FormEvent) => { e.preventDefault(); post('/pos-settings'); };

    return (
        <form onSubmit={save}>
            <section className="rounded-xl border p-6 space-y-4">
                <h3 className="font-semibold text-base border-b pb-2">Mail (SMTP) Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="SMTP Host" value={data.smtp_host} onChange={(v) => setData('smtp_host', v)} />
                    <Field label="SMTP Port" type="number" value={data.smtp_port} onChange={(v) => setData('smtp_port', v)} />
                    <Field label="SMTP Username" value={data.smtp_username} onChange={(v) => setData('smtp_username', v)} />
                    <Field label="SMTP Password" type="password" value={data.smtp_password} onChange={(v) => setData('smtp_password', v)} />
                    <div>
                        <label className="block text-sm font-medium mb-1">Encryption</label>
                        <select value={data.smtp_encryption} onChange={(e) => setData('smtp_encryption', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                            {['tls', 'ssl', 'none'].map((e) => <option key={e} value={e}>{e.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <Field label="From Name" value={data.from_name} onChange={(v) => setData('from_name', v)} />
                    <Field label="From Email" type="email" value={data.from_email} onChange={(v) => setData('from_email', v)} />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                        {processing ? 'Saving...' : 'Save Mail Settings'}
                    </button>
                </div>
            </section>
        </form>
    );
}

function SmsTab({ defaults }: { defaults: Record<string, string> }) {
    const { data, setData, post, processing } = useForm({
        group: 'sms', provider: defaults.provider || 'twilio', api_key: defaults.api_key || '', api_secret: defaults.api_secret || '',
        sender_id: defaults.sender_id || '', template_sale: defaults.template_sale || '', template_due: defaults.template_due || '',
    });
    const save = (e: React.FormEvent) => { e.preventDefault(); post('/pos-settings'); };

    return (
        <form onSubmit={save}>
            <section className="rounded-xl border p-6 space-y-4">
                <h3 className="font-semibold text-base border-b pb-2">SMS Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Provider</label>
                        <select value={data.provider} onChange={(e) => setData('provider', e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                            {['twilio', 'banglalink', 'grameenphone', 'robi', 'custom'].map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                        </select>
                    </div>
                    <Field label="Sender ID" value={data.sender_id} onChange={(v) => setData('sender_id', v)} />
                    <Field label="API Key" value={data.api_key} onChange={(v) => setData('api_key', v)} />
                    <Field label="API Secret" type="password" value={data.api_secret} onChange={(v) => setData('api_secret', v)} />
                </div>
                <Textarea label="Sale Template" value={data.template_sale} onChange={(v) => setData('template_sale', v)} placeholder="Use {name}, {invoice_no}, {total}, {date} as placeholders" />
                <Textarea label="Due Reminder Template" value={data.template_due} onChange={(v) => setData('template_due', v)} placeholder="Use {name}, {due_amount}, {phone} as placeholders" />
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                        {processing ? 'Saving...' : 'Save SMS Settings'}
                    </button>
                </div>
            </section>
        </form>
    );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
    );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={3} placeholder={placeholder} />
        </div>
    );
}
