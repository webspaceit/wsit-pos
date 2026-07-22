import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/pos-utils';

interface Category { id: number; name: string; }
interface Unit { id: number; name: string; short_name: string; }
interface Product {
    id: number; name: string; sku: string; barcode: string | null;
    category: Category | null; unit: Unit | null;
    purchase_price: number; selling_price: number; stock_quantity: number;
    min_stock: number; is_active: boolean;
}
interface Paginated { data: Product[]; current_page: number; last_page: number; per_page: number; total: number; }
interface Props { products: Paginated; categories: Category[]; units: Unit[]; }

export default function ProductsIndex({ products, categories, units }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const handleSearch = () => {
        router.get('/products', { search, category_id: catFilter, stock_status: stockFilter }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Products', href: '/products' }]}>
            <Head title="Products" />
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="rounded-md border px-3 py-2 text-sm" />
                    <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="">All Categories</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                        <option value="">All Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>
                    <button onClick={handleSearch} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Search</button>
                    <button onClick={() => setShowCreate(true)} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 ml-auto">+ Add Product</button>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">SKU</th>
                                <th className="px-3 py-2 text-left">Category</th>
                                <th className="px-3 py-2 text-right">Purchase</th>
                                <th className="px-3 py-2 text-right">Selling</th>
                                <th className="px-3 py-2 text-right">Stock</th>
                                <th className="px-3 py-2 text-center">Status</th>
                                <th className="px-3 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 font-medium">{p.name}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                                    <td className="px-3 py-2">{p.category?.name ?? '-'}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.purchase_price)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(p.selling_price)}</td>
                                    <td className="px-3 py-2 text-right">
                                        <span className={p.stock_quantity <= p.min_stock && p.min_stock > 0 ? 'text-orange-600 font-semibold' : ''}>{p.stock_quantity}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right space-x-2">
                                        <button onClick={() => setEditing(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => setDeleting(p)} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">No products found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {products.data.length} of {products.total} products</span>
                    <div className="flex gap-1">
                        {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => router.get('/products', { ...{ search, category_id: catFilter, stock_status: stockFilter }, page }, { preserveState: true })}
                                className={`px-3 py-1 rounded ${page === products.current_page ? 'bg-blue-600 text-white' : 'border'}`}>{page}</button>
                        ))}
                    </div>
                </div>
            </div>

            {showCreate && <ProductModal title="Add Product" onClose={() => setShowCreate(false)} categories={categories} units={units} />}
            {editing && <ProductModal title="Edit Product" product={editing} onClose={() => setEditing(null)} categories={categories} units={units} />}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-96">
                        <h3 className="text-lg font-semibold mb-2">Delete Product</h3>
                        <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete <strong>{deleting.name}</strong>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleting(null)} className="px-4 py-2 rounded border text-sm">Cancel</button>
                            <button onClick={() => { router.delete(`/products/${deleting.id}`, { onFinish: () => setDeleting(null) }); }} className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function ProductModal({ title, product, onClose, categories, units }: { title: string; product?: any; onClose: () => void; categories: Category[]; units: Unit[] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '', sku: product?.sku || '', barcode: product?.barcode || '',
        category_id: product?.category_id || '', unit_id: product?.unit_id || '',
        purchase_price: product?.purchase_price || 0, selling_price: product?.selling_price || 0,
        tax_rate: product?.tax_rate || 0, tax_type: product?.tax_type || 'exclusive',
        stock_quantity: product?.stock_quantity || 0, min_stock: product?.min_stock || 0,
        max_stock: product?.max_stock || 0, description: product?.description || '',
        is_active: product?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            put(`/products/${product.id}`, { onSuccess: onClose });
        } else {
            post('/products', { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-full max-w-2xl my-4">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} required />
                        <Field label="SKU" value={data.sku} onChange={(v) => setData('sku', v)} error={errors.sku} placeholder="Auto-generated if empty" />
                        <Field label="Barcode" value={data.barcode} onChange={(v) => setData('barcode', v)} error={errors.barcode} placeholder="Auto-generated if empty" />
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                <option value="">None</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Unit</label>
                            <select value={data.unit_id} onChange={(e) => setData('unit_id', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                <option value="">None</option>
                                {units.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.short_name})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tax Type</label>
                            <select value={data.tax_type} onChange={(e) => setData('tax_type', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                                <option value="exclusive">Exclusive</option>
                                <option value="inclusive">Inclusive</option>
                            </select>
                        </div>
                        <Field label="Purchase Price" type="number" value={data.purchase_price} onChange={(v) => setData('purchase_price', v)} error={errors.purchase_price} />
                        <Field label="Selling Price" type="number" value={data.selling_price} onChange={(v) => setData('selling_price', v)} error={errors.selling_price} />
                        <Field label="Tax Rate (%)" type="number" value={data.tax_rate} onChange={(v) => setData('tax_rate', v)} />
                        <Field label="Stock Quantity" type="number" value={data.stock_quantity} onChange={(v) => setData('stock_quantity', v)} />
                        <Field label="Min Stock" type="number" value={data.min_stock} onChange={(v) => setData('min_stock', v)} />
                        <Field label="Max Stock" type="number" value={data.max_stock} onChange={(v) => setData('max_stock', v)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={2} />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /> Active
                    </label>
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, error, type = 'text', required = false, placeholder = '' }: {
    label: string; value: any; onChange: (v: any) => void; error?: string; type?: string; required?: boolean; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? e.target.value : e.target.value)} required={required} placeholder={placeholder}
                className="w-full rounded-md border px-3 py-2 text-sm" />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
