<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('settings/business', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:150',
            'business_address' => 'nullable|string',
            'business_phone' => 'nullable|string|max:30',
            'business_email' => 'nullable|email|max:100',
            'business_logo' => 'nullable|string|max:255',
            'business_website' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:50',
            'tax_rate' => 'numeric|min:0|max:100',
            'currency' => 'nullable|string|max:10',
            'currency_symbol' => 'nullable|string|max:5',
            'receipt_footer' => 'nullable|string',
            'invoice_prefix' => 'nullable|string|max:10',
            'low_stock_threshold' => 'numeric|min:0',
            'timezone' => 'nullable|string|max:50',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setValue($key, $value, 'business', 'text');
        }

        return redirect()->route('settings.business')->with('success', 'Business settings updated successfully.');
    }
}
