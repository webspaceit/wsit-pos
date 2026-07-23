import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manufacturing', href: '/manufacturing/recipes' },
    { title: 'Recipes', href: '/manufacturing/recipes' },
];

interface RecipeItem {
    product_id: string;
    quantity: number;
    unit_cost: number;
}

export default function Recipes({ recipes, products, filters }: { recipes: { data: any[]; links: any[] }; products: any[]; filters: any }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', product_id: '', yield_quantity: '1', notes: '',
        items: [{ product_id: '', quantity: 1, unit_cost: 0 }] as RecipeItem[],
    });

    const addItem = () => setData('items', [...data.items, { product_id: '', quantity: 1, unit_cost: 0 }]);
    const removeItem = (i: number) => setData('items', data.items.filter((_: any, idx: number) => idx !== i));
    const updateItem = (i: number, field: string, value: any) => {
        const items = [...data.items];
        (items[i] as any)[field] = value;
        if (field === 'product_id') {
            const product = products.find((p: any) => String(p.id) === String(value));
            if (product) items[i].unit_cost = Number(product.unit_price);
        }
        setData('items', items);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/manufacturing/recipes/${editItem.id}` : '/manufacturing/recipes';
        post(url, { onSuccess: () => { reset(); setShowCreate(false); setEditItem(null); } });
    };

    const openEdit = (recipe: any) => {
        setEditItem(recipe);
        setData({
            name: recipe.name, product_id: String(recipe.product_id), yield_quantity: String(recipe.yield_quantity),
            notes: recipe.notes || '',
            items: recipe.items.map((i: any) => ({ product_id: String(i.product_id), quantity: i.quantity, unit_cost: i.unit_cost })),
        });
        setShowCreate(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipes" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Production Recipes</h1>
                    <button onClick={() => { setEditItem(null); reset(); setShowCreate(true); }} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">+ Add Recipe</button>
                </div>

                {showCreate && (
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-semibold">{editItem ? 'Edit Recipe' : 'New Recipe'}</h2>
                        <form onSubmit={submit} className="space-y-3">
                            <div><label className="block text-sm font-medium">Name *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.name} onChange={e => setData('name', e.target.value)} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium">Output Product *</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.product_id} onChange={e => setData('product_id', e.target.value)}><option value="">Select</option>{products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                                <div><label className="block text-sm font-medium">Yield Quantity *</label><input type="number" step="0.01" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.yield_quantity} onChange={e => setData('yield_quantity', e.target.value)} /></div>
                            </div>
                            <div><label className="block text-sm font-medium">Notes</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="font-semibold text-sm">Ingredients *</span><button type="button" onClick={addItem} className="rounded border px-2 py-1 text-xs hover:bg-gray-50">+ Add</button></div>
                                {data.items.map((item, i) => (
                                    <div key={i} className="grid grid-cols-[1fr_80px_80px_30px] gap-2 mb-2 items-end">
                                        <select className="rounded border px-2 py-2 text-sm" value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}><option value="">Material</option>{products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                        <input type="number" step="0.01" placeholder="Qty" className="rounded border px-2 py-2 text-sm" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} />
                                        <input type="number" step="0.01" placeholder="Cost" className="rounded border px-2 py-2 text-sm" value={item.unit_cost} onChange={e => updateItem(i, 'unit_cost', Number(e.target.value))} />
                                        <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 text-sm">x</button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">{editItem ? 'Update' : 'Save'}</button>
                                <button type="button" onClick={() => { setShowCreate(false); setEditItem(null); }} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Output Product</th><th className="px-4 py-3 text-left">Yield</th><th className="px-4 py-3 text-left">Ingredients</th><th className="px-4 py-3 text-left">Cost</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                        <tbody>
                            {recipes.data.map((r: any) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{r.name}</td>
                                    <td className="px-4 py-3">{r.product?.name}</td>
                                    <td className="px-4 py-3">{r.yield_quantity}</td>
                                    <td className="px-4 py-3">{r.items?.length || 0} items</td>
                                    <td className="px-4 py-3">৳{Number(r.total_cost || 0).toLocaleString()}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${r.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{r.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => openEdit(r)} className="text-blue-600 hover:underline text-sm mr-2">Edit</button>
                                        <button onClick={() => router.delete(`/manufacturing/recipes/${r.id}`)} className="text-red-600 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {!recipes.data.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No recipes</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
