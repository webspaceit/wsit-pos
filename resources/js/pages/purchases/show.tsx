import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Props {
    purchase: { id: number; reference_no: string; date: string; status: string; total: number; discount: number; tax_amount: number; shipping_cost: number; grand_total: number; paid_amount: number; due_amount: number; notes: string; supplier: { name: string } | null; user: { name: string }; branch: { name: string }; items: Array<{ id: number; product: { name: string; sku: string }; quantity: number; unit_price: number; discount: number; tax_amount: number; total: number }> };
}

export default function PurchaseShow({ purchase }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Purchases', href: '/purchases' }, { title: purchase.reference_no, href: `/purchases/${purchase.id}` }]}>
            <Head title={`Purchase ${purchase.reference_no}`} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">{purchase.reference_no}</h2>
                        <p className="text-sm text-muted-foreground">Created by {purchase.user.name} | Branch: {purchase.branch.name}</p>
                    </div>
                    <div className="flex gap-2">
                        {purchase.status === 'pending' && (
                            <button onClick={() => router.patch(`/purchases/${purchase.id}/receive`)} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Mark as Received</button>
                        )}
                        <Link href="/purchases" className="text-sm text-blue-600 hover:underline">← Back</Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <InfoBox label="Date" value={formatDate(purchase.date)} />
                    <InfoBox label="Supplier" value={purchase.supplier?.name ?? 'N/A'} />
                    <InfoBox label="Status" value={<span className={`rounded-full px-2 py-0.5 text-xs ${purchase.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{purchase.status}</span>} />
                    <InfoBox label="Grand Total" value={formatCurrency(purchase.grand_total)} highlight />
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">SKU</th>
                            <th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Unit Price</th>
                            <th className="px-3 py-2 text-right">Discount</th><th className="px-3 py-2 text-right">Tax</th>
                            <th className="px-3 py-2 text-right">Total</th>
                        </tr></thead>
                        <tbody>
                            {purchase.items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-3 py-2">{item.product.name}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{item.product.sku}</td>
                                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.discount)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(item.tax_amount)}</td>
                                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-72 space-y-1 rounded-xl border p-4 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(purchase.total)}</span></div>
                        <div className="flex justify-between"><span>Discount</span><span>- {formatCurrency(purchase.discount)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(purchase.tax_amount)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(purchase.shipping_cost)}</span></div>
                        <div className="flex justify-between border-t pt-1 font-bold"><span>Grand Total</span><span>{formatCurrency(purchase.grand_total)}</span></div>
                        <div className="flex justify-between"><span>Paid</span><span>{formatCurrency(purchase.paid_amount)}</span></div>
                        <div className="flex justify-between text-red-600 font-semibold"><span>Due</span><span>{formatCurrency(purchase.due_amount)}</span></div>
                    </div>
                </div>

                {purchase.notes && <div className="rounded-xl border p-4"><h3 className="font-semibold mb-1">Notes</h3><p className="text-sm text-muted-foreground">{purchase.notes}</p></div>}
            </div>
        </AppLayout>
    );
}

function InfoBox({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
    return <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className={`text-sm ${highlight ? 'font-bold text-lg' : 'font-medium'}`}>{value}</p></div>;
}
