<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function __invoke()
    {
        $landing = Setting::where('group', 'landing')
            ->get()
            ->mapWithKeys(fn ($s) => [$s->key => $s->type === 'json' ? json_decode($s->value, true) : $s->value]);

        return Inertia::render('welcome', [
            'landing' => $landing,
            'auth' => [
                'user' => auth()->user() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                ] : null,
            ],
        ]);
    }
}
