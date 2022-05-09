<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

class CheckDeactivation
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     * @throws AuthenticationException
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->deactivated()) {
            $date = $request->user()->deactivated_until;

            $message = trans('auth.deactivated', [
                'date' => $date->toFormattedDateString()
            ]);

            throw new AuthenticationException($message);
        }
        return $next($request);
    }
}
