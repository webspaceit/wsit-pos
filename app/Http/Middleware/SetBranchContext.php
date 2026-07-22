<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetBranchContext
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            if ($user->branch_id && ! session('branch_id')) {
                session(['branch_id' => $user->branch_id]);
            }

            if ($request->input('branch_id')) {
                session(['branch_id' => $request->input('branch_id')]);
            }
        }

        return $next($request);
    }
}
