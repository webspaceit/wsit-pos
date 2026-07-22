import { Head, Link } from '@inertiajs/react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { formatCurrency } from '@/lib/pos-utils';

interface Product { id: number; name: string; sku: string; barcode: string; price: number; tax_rate: number; tax_type: string; stock: number; }
interface Customer { id: number; name: string; phone: string; balance: number; }
interface CartItem { product_id: number; name: string; sku: string; price: number; quantity: number; tax_rate: number; discount: number; total: number; }
interface Props { products: Product[]; customers: Customer[]; branchId: number | null; }

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bkash', label: 'bKash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
];

export default function PosTerminal({ products, customers, branchId }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
    const [paidAmount, setPaidAmount] = useState(0);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const barcodeRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);

    const addToCart = useCallback((product: Product) => {
        if (product.stock <= 0) { setError(`${product.name} is out of stock`); return; }
        setCart((prev) => {
            const existing = prev.find((i) => i.product_id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) { setError(`Only ${product.stock} available for ${product.name}`); return prev; }
                return prev.map((i) => i.product_id === product.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price - i.discount } : i);
            }
            return [...prev, { product_id: product.id, name: product.name, sku: product.sku, price: product.price, quantity: 1, tax_rate: product.tax_rate, discount: 0, total: product.price }];
        });
        setError('');
    }, []);

    const handleBarcode = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const product = products.find((p) => p.barcode === barcodeInput || p.sku === barcodeInput);
            if (product) { addToCart(product); setBarcodeInput(''); }
            else { setError(`No product found for: ${barcodeInput}`); setBarcodeInput(''); }
        }
    };

    const updateQty = (idx: number, qty: number) => {
        const product = products.find((p) => p.id === cart[idx].product_id);
        if (product && qty > product.stock) { setError(`Only ${product.stock} available`); return; }
        if (qty <= 0) { setCart(cart.filter((_, i) => i !== idx)); return; }
        setCart(cart.map((item, i) => i === idx ? { ...item, quantity: qty, total: qty * item.price - item.discount } : item));
    };

    const updateDiscount = (idx: number, disc: number) => {
        setCart(cart.map((item, i) => i === idx ? { ...item, discount: disc, total: item.quantity * item.price - disc } : item));
    };

    const removeItem = (idx: number) => setCart(cart.filter((_, i) => i !== idx));

    const subtotal = cart.reduce((s, i) => s + i.total, 0);
    const tax = cart.reduce((s, i) => s + (i.total * i.tax_rate / 100), 0);
    const cartDiscount = discountType === 'percent' ? subtotal * (discount / 100) : discount;
    const grandTotal = Math.max(0, subtotal + tax - cartDiscount);
    const change = Math.max(0, paidAmount - grandTotal);
    const due = Math.max(0, grandTotal - paidAmount);

    const checkout = async () => {
        if (cart.length === 0) { setError('Cart is empty'); return; }
        setProcessing(true); setError('');
        try {
            const res = await fetch('/pos/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '', 'Accept': 'application/json' },
                body: JSON.stringify({
                    customer_id: customerId || null,
                    items: cart.map(({ name, tax_rate, ...rest }) => rest),
                    discount, discount_type: discountType,
                    shipping_cost: 0,
                    paid_amount: paymentMethod === 'cash' ? Math.max(grandTotal, paidAmount) : grandTotal,
                    payment_method: paymentMethod,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setResult(data);
                setCart([]); setPaidAmount(0); setDiscount(0); setCustomerId('');
            } else {
                setError(data.error || data.message || 'Checkout failed');
            }
        } catch (e) { setError('Network error. Please try again.'); }
        setProcessing(false);
    };

    const filteredProducts = products.filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q);
    });

    return (
        <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <Head title="POS Terminal" />

            {/* Top Bar */}
            <div className="flex items-center justify-between border-b bg-white px-4 py-2 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm font-bold text-blue-600">POS</Link>
                    <input ref={barcodeRef} type="text" value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} onKeyDown={handleBarcode} placeholder="Scan barcode..." className="rounded border px-3 py-1 text-sm w-48" />
                </div>
                <div className="flex items-center gap-3">
                    <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="rounded border px-3 py-1 text-sm">
                        <option value="">Walk-in Customer</option>
                        {customers.map((c) => <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>)}
                    </select>
                    <Link href="/dashboard" className="text-xs text-muted-foreground hover:underline">Dashboard</Link>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Products */}
                <div className="flex flex-1 flex-col border-r bg-white dark:bg-gray-800">
                    <div className="border-b p-3">
                        <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products by name, SKU..." className="w-full rounded-md border px-3 py-2 text-sm" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredProducts.map((p) => (
                                <button key={p.id} onClick={() => addToCart(p)} disabled={p.stock <= 0}
                                    className={`rounded-lg border p-3 text-left text-sm transition hover:shadow-md ${p.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}`}>
                                    <p className="font-medium truncate">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                                    <p className="mt-1 font-bold text-blue-600">{formatCurrency(p.price)}</p>
                                    <p className={`text-xs ${p.stock <= 0 ? 'text-red-600' : 'text-green-600'}`}>Stock: {p.stock}</p>
                                </button>
                            ))}
                            {filteredProducts.length === 0 && <p className="col-span-full py-8 text-center text-muted-foreground">No products found</p>}
                        </div>
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="flex w-96 flex-col bg-white dark:bg-gray-800">
                    <div className="border-b p-3">
                        <h2 className="font-semibold">Cart ({cart.length} items)</h2>
                    </div>

                    {error && <div className="mx-3 mt-2 rounded bg-red-50 p-2 text-xs text-red-600">{error}</div>}

                    <div className="flex-1 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">Scan barcode or click products to add</div>
                        ) : (
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-muted"><tr>
                                    <th className="px-2 py-1 text-left">Item</th><th className="px-2 py-1 text-right">Qty</th>
                                    <th className="px-2 py-1 text-right">Price</th><th className="px-2 py-1 text-right">Total</th>
                                    <th className="px-2 py-1 text-center">X</th>
                                </tr></thead>
                                <tbody>
                                    {cart.map((item, idx) => (
                                        <tr key={item.product_id} className="border-t">
                                            <td className="px-2 py-1.5">
                                                <p className="font-medium">{item.name}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className="text-muted-foreground">Disc:</span>
                                                    <input type="number" value={item.discount} onChange={(e) => updateDiscount(idx, parseFloat(e.target.value) || 0)} className="w-14 rounded border px-1 py-0.5 text-right" min="0" step="0.01" />
                                                </div>
                                            </td>
                                            <td className="px-2 py-1.5 text-right">
                                                <input type="number" value={item.quantity} onChange={(e) => updateQty(idx, parseFloat(e.target.value) || 0)} className="w-14 rounded border px-1 py-0.5 text-right" min="0.01" step="0.01" />
                                            </td>
                                            <td className="px-2 py-1.5 text-right">{formatCurrency(item.price)}</td>
                                            <td className="px-2 py-1.5 text-right font-medium">{formatCurrency(item.total)}</td>
                                            <td className="px-2 py-1.5 text-center"><button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">×</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="border-t p-3 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                                <span>Disc:</span>
                                <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className="rounded border px-1 py-0.5 text-xs">
                                    <option value="fixed">৳</option><option value="percent">%</option>
                                </select>
                            </div>
                            <input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-20 rounded border px-2 py-0.5 text-right text-xs" min="0" />
                        </div>
                        <div className="flex justify-between border-t pt-1 text-lg font-bold">
                            <span>Grand Total</span><span>{formatCurrency(grandTotal)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="rounded border px-2 py-1 text-xs">
                                {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">Paid:</span>
                                <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right text-sm font-bold" min="0" step="0.01" />
                            </div>
                        </div>
                        {change > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Change</span><span>{formatCurrency(change)}</span></div>}
                        {due > 0 && <div className="flex justify-between text-red-600 font-semibold"><span>Due</span><span>{formatCurrency(due)}</span></div>}
                        <button onClick={checkout} disabled={processing || cart.length === 0} className="w-full rounded-md bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50">
                            {processing ? 'Processing...' : paymentMethod === 'cash' ? `PAY ${formatCurrency(Math.max(grandTotal, paidAmount))}` : `CHARGE ${formatCurrency(grandTotal)}`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="rounded-xl bg-white p-6 dark:bg-gray-800 w-80 text-center">
                        <div className="mb-3 text-4xl text-green-600">✓</div>
                        <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                        <p className="text-sm text-muted-foreground mb-1">Invoice: {result.invoice_no}</p>
                        <p className="text-lg font-bold">{formatCurrency(result.grand_total)}</p>
                        <p className="text-sm">Paid: {formatCurrency(result.paid_amount)}</p>
                        {result.change > 0 && <p className="text-sm text-green-600 font-semibold">Change: {formatCurrency(result.change)}</p>}
                        {result.due_amount > 0 && <p className="text-sm text-red-600">Due: {formatCurrency(result.due_amount)}</p>}
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => window.print()} className="flex-1 rounded border py-2 text-sm">Print</button>
                            <button onClick={() => setResult(null)} className="flex-1 rounded bg-blue-600 py-2 text-sm text-white hover:bg-blue-700">New Sale</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
