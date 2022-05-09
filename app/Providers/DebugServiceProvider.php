<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Console\Input\ArgvInput;

class DebugServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->shouldDebug()) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Detect debug environment
     *
     * @return bool
     */
    protected function shouldDebug()
    {
        return $this->app->environment('local') && (!$this->app->runningInConsole() || !$this->runningExcludedCommand());
    }

    /**
     * Detect if running excluded command
     *
     * @return bool
     */
    protected function runningExcludedCommand()
    {
        $command = new ArgvInput();

        return in_array($command->getFirstArgument(), [
            "key:generate",
            "package:discover",
            "server:install",
            "server:publish"
        ]);
    }
}
