import { Head, router } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface Product { id: number; name: string; stock_quantity: number; }
interface SaleItem { product: Product; quantity: number; }
interface Sale { id: number; invoice_no: string; customer: { name: string; id: number } | null; items: SaleItem[]; }
interface Customer { id: number; name: string; }
interface Props { sale: Sale; customers: Customer[]; }

export default function ChallanCreate({ sale, customers }: Props) {
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [customerId, setCustomerId] = React.useState(sale.customer?.id?.toString() ?? '');
    const [deliveryAddress, setDeliveryAddress] = React.useState('');
    const [driverName, setDriverName] = React.useState('');
    const [vehicleNo, setVehicleNo] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const [items, setItems] = React.useState(sale.items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })));

    const updateItem = (idx: number, field: string, value: string | number) => {
        const newItems = [...items];
        (newItems[idx] as Record<string, unknown>)[field] = value;
        setItems(newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/challans', {
            sale_id: sale.id, customer_id: customerId || null, date,
            delivery_address: deliveryAddress, driver_name: driverName, vehicle_no: vehicleNo,
            notes, items,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Challans', href: '/challans' }, { title: 'Create', href: '/challans/create' }]}>
            <Head title="Create Challan" />
            <div className="p-4 max-w-3xl">
                <h1 className="text-lg font-semibold mb-4">Challan for — {sale.invoice_no}</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Customer</label><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm"><option value="">Select</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Driver Name</label><input value={driverName} onChange={(e) => setDriverName(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                        <div><label className="block text-sm font-medium mb-1">Vehicle No</label><input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Delivery Address</label><input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" /></div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-right">Qty</th></tr></thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-3 py-2">{sale.items[idx]?.product.name}</td>
                                        <td className="px-3 py-2 text-right"><input type="number" step="0.01" min="0.01" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => router.get('/challans')} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                        <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">Create</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
