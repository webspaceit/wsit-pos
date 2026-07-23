import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'WhatsApp', href: '/whatsapp' },
    { title: 'Settings', href: '/whatsapp/settings' },
];

export default function WhatsAppSettings({ settings }: { settings: Record<string, Record<string, string>> }) {
    const [activeTab, setActiveTab] = useState('api');
    const { data, setData, post, processing } = useForm({
        group: 'api',
        api_key: settings.api?.api_key || '',
        api_secret: settings.api?.api_secret || '',
        phone_number_id: settings.api?.phone_number_id || '',
        verify_token: settings.api?.verify_token || '',
        business_name: settings.business?.business_name || '',
        enable_delivery_notifications: settings.notifications?.enable_delivery_notifications === '1',
        enable_payment_reminders: settings.notifications?.enable_payment_reminders === '1',
        enable_order_confirmations: settings.notifications?.enable_order_confirmations === '1',
    });

    const save = (group: string) => {
        setData('group', group);
        post('/whatsapp/settings');
    };

    const tabs = [
        { key: 'api', label: 'API Configuration' },
        { key: 'business', label: 'Business Info' },
        { key: 'notifications', label: 'Notifications' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="WhatsApp Settings" />
            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">WhatsApp Settings</h1>
                <div className="flex gap-2 border-b pb-2">
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 text-sm rounded-t ${activeTab === tab.key ? 'bg-white border border-b-0 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>{tab.label}</button>
                    ))}
                </div>

                {activeTab === 'api' && (
                    <div className="rounded-lg border bg-white p-4 space-y-3">
                        <h2 className="font-semibold">WhatsApp Business API Configuration</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="block text-sm font-medium">API Key</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.api_key} onChange={e => setData('api_key', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">API Secret</label><input type="password" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.api_secret} onChange={e => setData('api_secret', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Phone Number ID</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.phone_number_id} onChange={e => setData('phone_number_id', e.target.value)} /></div>
                            <div><label className="block text-sm font-medium">Verify Token</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.verify_token} onChange={e => setData('verify_token', e.target.value)} /></div>
                        </div>
                        <button onClick={() => save('api')} disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Save API Settings</button>
                    </div>
                )}

                {activeTab === 'business' && (
                    <div className="rounded-lg border bg-white p-4 space-y-3">
                        <h2 className="font-semibold">Business Information</h2>
                        <div><label className="block text-sm font-medium">Business Name</label><input className="mt-1 w-full max-w-md rounded border px-3 py-2 text-sm" value={data.business_name} onChange={e => setData('business_name', e.target.value)} /></div>
                        <button onClick={() => save('business')} disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Save Business Info</button>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="rounded-lg border bg-white p-4 space-y-3">
                        <h2 className="font-semibold">Notification Preferences</h2>
                        {[
                            { key: 'enable_delivery_notifications', label: 'Delivery Updates' },
                            { key: 'enable_payment_reminders', label: 'Payment Reminders' },
                            { key: 'enable_order_confirmations', label: 'Order Confirmations' },
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 text-sm">
                                <input type="checkbox" checked={(data as any)[item.key]} onChange={e => setData(item.key as any, e.target.checked)} className="h-4 w-4" />
                                {item.label}
                            </label>
                        ))}
                        <button onClick={() => save('notifications')} disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Save Notification Settings</button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
