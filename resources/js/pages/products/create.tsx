import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Category { id: number; name: string; }
interface Brand { id: number; name: string; }
interface Unit { id: number; name: string; short_name: string; }
interface Props { categories: Category[]; brands: Brand[]; units: Unit[]; }

export default function ProductCreate({ categories, brands, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', sku: '', barcode: '', category_id: '', brand_id: '', unit_id: '',
        purchase_price: 0, selling_price: 0, tax_rate: 0, tax_type: 'exclusive',
        stock_quantity: 0, min_stock: 0, max_stock: 0, description: '', is_active: true,
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); post('/products'); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Products', href: '/products' }, { title: 'Create', href: '/products/create' }]}>
            <Head title="Create Product" />
            <div className="p-4 max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Create Product</h2>
                <form onSubmit={submit} className="space-y-4 rounded-xl border p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Name *" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} />
                        <Field label="SKU" value={data.sku} onChange={(v) => setData('sku', v)} placeholder="Auto if empty" />
                        <Field label="Barcode" value={data.barcode} onChange={(v) => setData('barcode', v)} placeholder="Auto if empty" />
                        <div><label className="block text-sm font-medium mb-1">Category</label><select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="">None</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Brand</label><select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="">None</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Unit</label><select value={data.unit_id} onChange={(e) => setData('unit_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="">None</option>{units.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.short_name})</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Tax Type</label><select value={data.tax_type} onChange={(e) => setData('tax_type', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="exclusive">Exclusive</option><option value="inclusive">Inclusive</option></select></div>
                        <Field label="Purchase Price *" type="number" value={data.purchase_price} onChange={(v) => setData('purchase_price', v)} />
                        <Field label="Selling Price *" type="number" value={data.selling_price} onChange={(v) => setData('selling_price', v)} />
                        <Field label="Tax Rate (%)" type="number" value={data.tax_rate} onChange={(v) => setData('tax_rate', v)} />
                        <Field label="Stock Quantity" type="number" value={data.stock_quantity} onChange={(v) => setData('stock_quantity', v)} />
                        <Field label="Min Stock" type="number" value={data.min_stock} onChange={(v) => setData('min_stock', v)} />
                        <Field label="Max Stock" type="number" value={data.max_stock} onChange={(v) => setData('max_stock', v)} />
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} /></div>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Active</label>
                    <div className="flex justify-end gap-2 pt-2">
                        <a href="/products" className="px-4 py-2 rounded border text-sm">Cancel</a>
                        <button type="submit" disabled={processing} className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">{processing ? 'Saving...' : 'Create Product'}</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, value, onChange, error, type = 'text', placeholder = '' }: { label: string; value: any; onChange: (v: any) => void; error?: string; type?: string; placeholder?: string }) {
    return <div><label className="block text-sm font-medium mb-1">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-md border px-3 py-2 text-sm" />{error && <p className="text-xs text-red-600 mt-1">{error}</p>}</div>;
}
