<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageSettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::where('group', 'landing')
            ->get()
            ->mapWithKeys(fn ($s) => [$s->key => $s->type === 'json' ? $s->value : $s->value]);

        return Inertia::render('settings/landing-page', [
            'landing' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'required|string',
            'hero_cta_text' => 'required|string|max:100',
            'stats_title' => 'nullable|string|max:255',
            'stats_subtitle' => 'nullable|string|max:255',
            'stats' => 'nullable|array',
            'logos_title' => 'nullable|string|max:255',
            'logos' => 'nullable|array',
            'features_title' => 'required|string|max:255',
            'features_subtitle' => 'nullable|string|max:255',
            'features' => 'nullable|array',
            'pricing_title' => 'required|string|max:255',
            'pricing_subtitle' => 'nullable|string|max:255',
            'pricing' => 'nullable|array',
            'testimonials_title' => 'required|string|max:255',
            'testimonials' => 'nullable|array',
            'faq_title' => 'nullable|string|max:255',
            'faq_subtitle' => 'nullable|string|max:255',
            'faq' => 'nullable|array',
            'cta_title' => 'required|string|max:255',
            'cta_subtitle' => 'nullable|string',
            'cta_button_text' => 'required|string|max:100',
            'footer_text' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            $type = is_array($value) ? 'json' : 'text';
            Setting::setValue($key, $value, 'landing', $type);
        }

        return redirect()->route('admin.landing-page')->with('success', 'Landing page updated successfully.');
    }
}
