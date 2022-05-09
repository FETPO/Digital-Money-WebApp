<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RestrictDemo
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (config('app.demo') && !optional($request->user())->is_super_admin) {
            return abort(403, trans('auth.action_forbidden'));
        }
        return $next($request);
    }
}
