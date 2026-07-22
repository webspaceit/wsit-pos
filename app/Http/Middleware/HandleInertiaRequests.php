<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'phone' => $request->user()->phone,
                    'branch_id' => $request->user()->branch_id,
                    'is_active' => $request->user()->is_active,
                    'roles' => $request->user()->roles->pluck('name'),
                    'branch' => $request->user()->branch,
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'settings' => $request->user() ? Setting::getAll() : [],
            'branches' => $request->user() ? Branch::where('is_active', true)->orderBy('name')->get() : [],
            'currentBranch' => $request->user() && session('branch_id')
                ? Branch::find(session('branch_id'))
                : null,
        ];
    }
}
