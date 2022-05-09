<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class PluginServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $plugins = $this->getPlugins();

        foreach ($plugins as $path) {
            if (class_exists($class = $this->getProvider($path))) {
                $this->app->register($class);
            }
        }
    }

    /**
     * Get plugins
     *
     * @return array
     */
    protected function getPlugins()
    {
        return File::directories(app_path('Plugins'));
    }

    /**
     * Get plugin provider
     *
     * @param $path
     * @return string
     */
    protected function getProvider($path)
    {
        return "App\\Plugins\\" . basename($path) . "\\PluginServiceProvider";
    }
}
