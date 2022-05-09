<?php

namespace App\Abstracts;

use Illuminate\Support\ServiceProvider;

abstract class TokenServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishAssets();

        if (static::MOCK_TOKEN == config("coin.mock_token")) {
            app('coin.adapters')->push($this->getAdapter());
        }
    }

    /**
     * Get token adapter
     *
     * @return mixed
     */
    abstract protected function getAdapter();

    /**
     * Publish assets
     *
     * @return void
     */
    protected function publishAssets()
    {
        if (file_exists($path = $this->basePath() . '/assets')) {
            $this->publishes([$path => public_path('coin')], 'coin-assets');
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerResources();
    }

    /**
     * Register resources
     *
     * @return void
     */
    protected function registerResources()
    {
        $this->mergeConfigFrom($this->basePath() . '/config.php', $this->configName());
    }

    /**
     * Get base resource path
     *
     * @return string
     */
    protected function basePath()
    {
        return rtrim($this->resourcePath(), '/');
    }

    /**
     * Get config path
     *
     * @return string
     */
    abstract protected function resourcePath();

    /**
     * Get config name for token
     *
     * @return string
     */
    abstract protected function configName();
}