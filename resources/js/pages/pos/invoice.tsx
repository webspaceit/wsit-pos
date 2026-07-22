import { Head } from '@inertiajs/react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/pos-utils';

interface Props {
    sale: { id: number; invoice_no: string; reference_no: string; date: string; subtotal: number; discount: number; discount_type: string; tax_amount: number; shipping_cost: number; grand_total: number; paid_amount: number; due_amount: number; payment_method: string; notes: string; customer: { name: string; phone: string } | null; user: { name: string }; branch: { name: string; address: string; phone: string; email: string } | null; items: Array<{ product: { name: string }; quantity: number; unit_price: number; discount: number; total: number }> };
}

export default function Invoice({ sale }: Props) {
    return (
        <>
            <Head title={`Invoice ${sale.invoice_no}`} />
            <div className="flex justify-center bg-gray-100 min-h-screen p-4 print:bg-white">
                <div className="w-80 bg-white p-4 text-xs shadow-lg print:shadow-none print:w-full" id="invoice">
                    {/* Header */}
                    <div className="text-center border-b pb-3 mb-3">
                        <h1 className="text-lg font-bold">{sale.branch?.name || 'My POS Store'}</h1>
                        <p className="text-muted-foreground">{sale.branch?.address || ''}</p>
                        <p className="text-muted-foreground">{sale.branch?.phone || ''}</p>
                        {sale.branch?.email && <p className="text-muted-foreground">{sale.branch.email}</p>}
                        <p className="mt-1 font-semibold">INVOICE</p>
                    </div>

                    {/* Info */}
                    <div className="space-y-1 mb-3">
                        <div className="flex justify-between"><span className="text-muted-foreground">Invoice#</span><span className="font-mono font-medium">{sale.invoice_no}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDateTime(sale.date)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Cashier</span><span>{sale.user.name}</span></div>
                        {sale.customer && (
                            <>
                                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{sale.customer.name}</span></div>
                                {sale.customer.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{sale.customer.phone}</span></div>}
                            </>
                        )}
                    </div>

                    {/* Items */}
                    <table className="w-full mb-3">
                        <thead><tr className="border-y border-dashed"><th className="py-1 text-left">Item</th><th className="py-1 text-right">Qty</th><th className="py-1 text-right">Price</th><th className="py-1 text-right">Total</th></tr></thead>
                        <tbody>
                            {sale.items.map((item, i) => (
                                <tr key={i} className="border-b border-dashed">
                                    <td className="py-1">{item.product.name}</td>
                                    <td className="py-1 text-right">{item.quantity}</td>
                                    <td className="py-1 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="py-1 text-right">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="space-y-1 border-t pt-2">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(sale.subtotal)}</span></div>
                        {sale.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>- {formatCurrency(sale.discount)}</span></div>}
                        {sale.tax_amount > 0 && <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(sale.tax_amount)}</span></div>}
                        <div className="flex justify-between font-bold border-t pt-1"><span>Grand Total</span><span>{formatCurrency(sale.grand_total)}</span></div>
                        <div className="flex justify-between"><span>Paid ({sale.payment_method.replace('_', ' ')})</span><span>{formatCurrency(sale.paid_amount)}</span></div>
                        {sale.due_amount > 0 && <div className="flex justify-between text-red-600 font-semibold"><span>Due</span><span>{formatCurrency(sale.due_amount)}</span></div>}
                        {sale.paid_amount > sale.grand_total && <div className="flex justify-between text-green-600 font-semibold"><span>Change</span><span>{formatCurrency(sale.paid_amount - sale.grand_total)}</span></div>}
                    </div>

                    {/* Footer */}
                    <div className="text-center border-t mt-3 pt-3">
                        <p className="text-muted-foreground text-[10px]">Thank you for your purchase!</p>
                        <p className="text-muted-foreground text-[10px] mt-1">Powered by WSIT POS</p>
                    </div>
                </div>
            </div>
            <style>{`@media print { body * { visibility: hidden; } #invoice, #invoice * { visibility: visible; } #invoice { position: absolute; left: 0; top: 0; } }`}</style>
        </>
    );
}
