import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/pos-utils';

interface Props {
    sale: { id: number; invoice_no: string; reference_no: string; date: string; status: string; subtotal: number; discount: number; discount_type: string; tax_amount: number; shipping_cost: number; grand_total: number; paid_amount: number; due_amount: number; payment_method: string; notes: string; customer: { name: string; phone: string } | null; user: { name: string }; branch: { name: string; address: string; phone: string } | null; items: Array<{ id: number; product: { name: string; sku: string }; quantity: number; unit_price: number; discount: number; tax_amount: number; total: number }> };
}

export default function SaleShow({ sale }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Sales', href: '/sales' }, { title: sale.invoice_no, href: `/sales/${sale.id}` }]}>
            <Head title={`Sale ${sale.invoice_no}`} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">{sale.invoice_no}</h2>
                        <p className="text-sm text-muted-foreground">By {sale.user.name} | {sale.branch?.name}</p>
                    </div>
                    <div className="flex gap-2">
                        {sale.status === 'completed' && (
                            <button onClick={() => { if (confirm('Void this sale?')) router.patch(`/sales/${sale.id}/void`); }} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Void Sale</button>
                        )}
                        <Link href={`/pos/invoice/${sale.id}`} target="_blank" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Print Invoice</Link>
                        <Link href="/sales" className="text-sm text-blue-600 hover:underline">← Back</Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <InfoBox label="Date" value={formatDate(sale.date)} />
                    <InfoBox label="Customer" value={sale.customer?.name ?? 'Walk-in'} />
                    <InfoBox label="Payment" value={<span className="capitalize">{sale.payment_method.replace('_', ' ')}</span>} />
                    <InfoBox label="Status" value={<span className={`rounded-full px-2 py-0.5 text-xs ${sale.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{sale.status}</span>} />
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
                            {sale.items.map((item) => (
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
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(sale.subtotal)}</span></div>
                        <div className="flex justify-between"><span>Discount</span><span>- {formatCurrency(sale.discount)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(sale.tax_amount)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(sale.shipping_cost)}</span></div>
                        <div className="flex justify-between border-t pt-1 font-bold"><span>Grand Total</span><span>{formatCurrency(sale.grand_total)}</span></div>
                        <div className="flex justify-between"><span>Paid</span><span>{formatCurrency(sale.paid_amount)}</span></div>
                        <div className="flex justify-between text-red-600 font-semibold"><span>Due</span><span>{formatCurrency(sale.due_amount)}</span></div>
                    </div>
                </div>

                {sale.customer && sale.due_amount > 0 && (
                    <Link href={`/due-collections?customer_id=${sale.customer?.name}`} className="text-sm text-blue-600 hover:underline">→ Collect Due Payment</Link>
                )}
                {sale.notes && <div className="rounded-xl border p-4"><h3 className="font-semibold mb-1">Notes</h3><p className="text-sm text-muted-foreground">{sale.notes}</p></div>}
            </div>
        </AppLayout>
    );
}

function InfoBox({ label, value }: { label: string; value: React.ReactNode }) {
    return <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div>;
}
