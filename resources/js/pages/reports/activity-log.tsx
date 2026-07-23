import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/pos-utils';

interface Log { id: number; type: string; subject_type: string; subject_id: number; description: string; properties: Record<string, unknown> | null; user: { name: string }; created_at: string; }
interface Paginated { data: Log[]; current_page: number; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }>; }
interface Props { logs: Paginated; types: string[]; filter: { type?: string } }

const TYPE_LABELS: Record<string, string> = { sale_created: 'Sale Created', sale_voided: 'Sale Voided', purchase_created: 'Purchase Created', product_created: 'Product Created', product_updated: 'Product Updated', stock_adjusted: 'Stock Adjusted', user_created: 'User Created' };

export default function ActivityLogPage({ logs, types, filter }: Props) {
    const [type, setType] = useState(filter.type || '');

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }, { title: 'Activity Log', href: '/reports/activity-log' }]}>
            <Head title="Activity Log" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Activity Log</h2>
                    <div className="flex items-center gap-3">
                        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                            <option value="">All Types</option>
                            {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
                        </select>
                        <button onClick={() => router.get('/reports/activity-log', type ? { type } : {}, { preserveState: true })} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Filter</button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted"><tr>
                            <th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">User</th>
                            <th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-left">Description</th>
                        </tr></thead>
                        <tbody>
                            {logs.data.map((log) => (
                                <tr key={log.id} className="border-t hover:bg-muted/50">
                                    <td className="px-3 py-2 text-xs whitespace-nowrap">{formatDate(log.created_at)} {new Date(log.created_at).toLocaleTimeString()}</td>
                                    <td className="px-3 py-2">{log.user.name}</td>
                                    <td className="px-3 py-2"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{TYPE_LABELS[log.type] || log.type}</span></td>
                                    <td className="px-3 py-2 text-muted-foreground">{log.description}</td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">No activity</td></tr>}
                        </tbody>
                    </table>
                </div>
                {logs.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {logs.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url)} className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'}`}>{link.label}</button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
