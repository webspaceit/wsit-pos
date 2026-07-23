import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'AI Assistant', href: '/ai-assistant' },
];

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    data?: any;
    timestamp: Date;
}

const quickActions = [
    { label: 'Today\'s Sales', question: 'What are today\'s sales?' },
    { label: 'Monthly Profit', question: 'Show monthly profit' },
    { label: 'Low Stock', question: 'Show low stock products' },
    { label: 'Total Due', question: 'How much due from customers?' },
    { label: 'Expenses', question: 'What are today\'s expenses?' },
    { label: 'Customer Count', question: 'How many customers?' },
    { label: 'Active Repairs', question: 'Active repairs status' },
    { label: 'Active Projects', question: 'Active projects status' },
];

export default function AiAssistant({ stats, recentSales, topProducts, lowStockProducts }: { stats: any; recentSales: any[]; topProducts: any[]; lowStockProducts: any[] }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (question: string) => {
        if (!question.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: question, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/ai-assistant/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '' },
                body: JSON.stringify({ question }),
            });

            const result = await response.json();
            const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: result.answer, data: result.data, timestamp: new Date() };
            setMessages(prev => [...prev, assistantMsg]);
        } catch {
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Assistant" />
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Left: Dashboard Stats */}
                <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto hidden lg:block">
                    <h2 className="font-semibold mb-3">Quick Overview</h2>
                    <div className="space-y-2 text-sm">
                        <div className="rounded bg-white p-3 border"><p className="text-gray-500">Today's Sales</p><p className="text-lg font-bold text-emerald-600">৳{Number(stats.today_sales).toLocaleString()}</p></div>
                        <div className="rounded bg-white p-3 border"><p className="text-gray-500">Month Sales</p><p className="text-lg font-bold text-emerald-600">৳{Number(stats.month_sales).toLocaleString()}</p></div>
                        <div className="rounded bg-white p-3 border"><p className="text-gray-500">Today's Expenses</p><p className="text-lg font-bold text-red-600">৳{Number(stats.today_expenses).toLocaleString()}</p></div>
                        <div className="rounded bg-white p-3 border"><p className="text-gray-500">Total Due</p><p className="text-lg font-bold text-orange-600">৳{Number(stats.total_due).toLocaleString()}</p></div>
                        <div className="rounded bg-white p-3 border"><p className="text-gray-500">Low Stock Items</p><p className="text-lg font-bold text-red-600">{stats.low_stock}</p></div>
                        <div className="rounded bg-white p-3 border"><p className="text-gray-500">Active Repairs</p><p className="text-lg font-bold">{stats.active_repairs}</p></div>
                    </div>
                    <h2 className="font-semibold mt-4 mb-3">Quick Actions</h2>
                    <div className="space-y-1">
                        {quickActions.map((action, i) => (
                            <button key={i} onClick={() => sendMessage(action.question)} className="w-full rounded bg-white border px-3 py-2 text-left text-sm hover:bg-blue-50 hover:border-blue-300 transition">{action.label}</button>
                        ))}
                    </div>
                </div>

                {/* Right: Chat */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-4xl mb-3">🤖</p>
                                <p className="text-lg font-medium">AI Business Assistant</p>
                                <p className="text-sm mt-1">Ask me about your sales, stock, expenses, customers, and more</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-lg mx-auto">
                                    {quickActions.slice(0, 4).map((action, i) => (
                                        <button key={i} onClick={() => sendMessage(action.question)} className="rounded-full border px-3 py-1 text-sm hover:bg-blue-50">{action.label}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-2xl rounded-lg px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    {msg.data && typeof msg.data === 'object' && !Array.isArray(msg.data) && (
                                        <div className="mt-2 rounded bg-gray-50 p-2 text-xs">
                                            {Object.entries(msg.data).map(([key, val]) => (
                                                <div key={key} className="flex justify-between"><span className="text-gray-500">{key}:</span><span className="font-medium">{typeof val === 'number' ? `৳${val.toLocaleString()}` : String(val)}</span></div>
                                            ))}
                                        </div>
                                    )}
                                    {Array.isArray(msg.data) && msg.data.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {msg.data.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-xs">
                                                    <span>{item.name || item.invoice_no || `Item ${i + 1}`}</span>
                                                    <span className="font-medium">{item.balance ? `৳${Number(item.balance).toLocaleString()}` : item.quantity ? `Qty: ${item.quantity}` : ''}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs mt-1 opacity-50">{msg.timestamp.toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start"><div className="rounded-lg bg-white border px-4 py-3"><p className="text-sm text-gray-500 animate-pulse">Thinking...</p></div></div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Mobile quick actions */}
                    <div className="lg:hidden px-4 pb-2 flex gap-1 overflow-x-auto">
                        {quickActions.slice(0, 4).map((action, i) => (
                            <button key={i} onClick={() => sendMessage(action.question)} className="shrink-0 rounded-full border px-3 py-1 text-xs hover:bg-blue-50">{action.label}</button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
                        <div className="flex gap-2">
                            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your business..." className="flex-1 rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" disabled={loading} />
                            <button type="submit" disabled={loading || !input.trim()} className="rounded-lg bg-blue-600 px-6 py-3 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
