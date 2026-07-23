<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosSettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'barcode' => Setting::getGroup('barcode'),
            'invoice' => Setting::getGroup('invoice'),
            'pos' => Setting::getGroup('pos'),
            'mail' => Setting::getGroup('mail'),
            'sms' => Setting::getGroup('sms'),
        ];

        return Inertia::render('settings/pos-settings', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $group = $request->group;

        $validated = match ($group) {
            'barcode' => $request->validate([
                'prefix' => 'nullable|string|max:20',
                'length' => 'required|integer|min:4|max:20',
                'type' => 'required|in:EAN13,EAN8,UPC,Code128,Code39,QR',
            ]),
            'invoice' => $request->validate([
                'prefix' => 'nullable|string|max:10',
                'next_number' => 'required|integer|min:1',
                'terms' => 'nullable|string',
                'header_text' => 'nullable|string',
                'show_tax' => 'boolean',
                'show_discount' => 'boolean',
                'show_customer' => 'boolean',
            ]),
            'pos' => $request->validate([
                'default_payment_method' => 'required|in:cash,card,bkash,nagad,rocket',
                'receipt_width' => 'required|in:58,80',
                'auto_print' => 'boolean',
                'show_stock' => 'boolean',
                'allow_discount' => 'boolean',
                'allow_price_edit' => 'boolean',
                'theme' => 'required|in:light,dark,auto',
            ]),
            'mail' => $request->validate([
                'smtp_host' => 'nullable|string|max:255',
                'smtp_port' => 'nullable|integer',
                'smtp_username' => 'nullable|string|max:255',
                'smtp_password' => 'nullable|string|max:255',
                'smtp_encryption' => 'nullable|in:tls,ssl,none',
                'from_name' => 'nullable|string|max:255',
                'from_email' => 'nullable|email|max:255',
            ]),
            'sms' => $request->validate([
                'provider' => 'nullable|in:twilio,banglalink,grameenphone,robi,custom',
                'api_key' => 'nullable|string|max:255',
                'api_secret' => 'nullable|string|max:255',
                'sender_id' => 'nullable|string|max:20',
                'template_sale' => 'nullable|string',
                'template_due' => 'nullable|string',
            ]),
            default => [],
        };

        foreach ($validated as $key => $value) {
            Setting::setValue($key, $value, $group, is_bool($value) ? 'boolean' : 'text');
        }

        return redirect()->route('settings.pos-settings.index')->with('success', ucfirst($group).' settings updated.');
    }
}
