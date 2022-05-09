<?php

namespace App\Providers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\ServiceProvider;

class MacroServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->setRedirectMacros();
    }

    /**
     * Bind redirect macros
     *
     * @return void
     */
    protected function setRedirectMacros()
    {
        RedirectResponse::macro('notify', function ($message, $type = 'info') {
            return $this->with('notification', compact("type", "message"));
        });
    }
}
