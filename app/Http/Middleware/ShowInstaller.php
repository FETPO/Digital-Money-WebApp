<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class ShowInstaller
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $installer = app('installer');

        if (!$installer->installed() || User::superAdmin()->doesntExist()) {
            return $next($request);
        }

        if ($request->wantsJson()) {
            return abort(403, 'Installation already completed.');
        }

        return redirect()->route('index');
    }
}
