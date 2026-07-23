<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandingController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/branding', [
            'logo' => Setting::getValue('branding_logo', null),
            'favicon' => Setting::getValue('branding_favicon', null),
        ]);
    }

    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        $old = Setting::getValue('branding_logo');
        if ($old && Storage::disk('public')->exists($old)) {
            Storage::disk('public')->delete($old);
        }

        $path = $request->file('logo')->store('branding', 'public');
        Setting::setValue('branding_logo', $path, 'branding', 'text');

        return back()->with('success', 'Logo updated successfully.');
    }

    public function updateFavicon(Request $request)
    {
        $request->validate([
            'favicon' => 'required|image|mimes:ico,png,svg|max:512',
        ]);

        $old = Setting::getValue('branding_favicon');
        if ($old && Storage::disk('public')->exists($old)) {
            Storage::disk('public')->delete($old);
        }

        $path = $request->file('favicon')->store('branding', 'public');
        Setting::setValue('branding_favicon', $path, 'branding', 'text');

        return back()->with('success', 'Favicon updated successfully.');
    }

    public function destroyLogo()
    {
        $old = Setting::getValue('branding_logo');
        if ($old && Storage::disk('public')->exists($old)) {
            Storage::disk('public')->delete($old);
        }
        Setting::setValue('branding_logo', '', 'branding', 'text');

        return back()->with('success', 'Logo removed.');
    }

    public function destroyFavicon()
    {
        $old = Setting::getValue('branding_favicon');
        if ($old && Storage::disk('public')->exists($old)) {
            Storage::disk('public')->delete($old);
        }
        Setting::setValue('branding_favicon', '', 'branding', 'text');

        return back()->with('success', 'Favicon removed.');
    }
}
