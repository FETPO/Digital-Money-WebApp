<?php

namespace App\Providers;

use App\CoinAdapters\BinanceAdapter;
use App\CoinAdapters\BitcoinAdapter;
use App\CoinAdapters\BitcoinCashAdapter;
use App\CoinAdapters\DashAdapter;
use App\CoinAdapters\EthereumAdapter;
use App\CoinAdapters\LitecoinAdapter;
use App\Helpers\CspPolicy;
use App\Helpers\InteractsWithStore;
use App\Helpers\Settings;
use App\Helpers\ValueStore;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use NeoScrypts\BitGo\BitGo;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerValueStore();
        $this->registerSettings();
        $this->registerCoinAdapters();
        $this->registerBitGo();
        $this->registerCspPolicy();
    }

    /**
     * Register BitGo
     *
     * @return void
     */
    protected function registerBitGo()
    {
        $this->app->bind(BitGo::class, function () {
            return new BitGo(
                config('services.bitgo.host'),
                config('services.bitgo.port'),
                config('services.bitgo.token')
            );
        });
    }

    /**
     * Register Value Store
     *
     * @return void
     */
    protected function registerValueStore()
    {
        $this->app->singleton(ValueStore::class, function () {
            return ValueStore::make(storage_path('app/settings.json'));
        });
    }

    /**
     * Register Settings
     *
     * @return void
     */
    protected function registerSettings()
    {
        $settings = new Settings();
        $this->app->instance(Settings::class, $settings);
        $this->app->instance('settings', $settings);
    }

    /**
     * Register coin adapters
     *
     * @return void
     */
    protected function registerCoinAdapters()
    {
        $this->app->singleton('coin.adapters', function () {
            return collect([
                BitcoinAdapter::class,
                BitcoinCashAdapter::class,
                DashAdapter::class,
                LitecoinAdapter::class,
                EthereumAdapter::class,
                BinanceAdapter::class,
            ]);
        });
    }

    /**
     * Register CSP Policy
     *
     * @return void
     */
    protected function registerCspPolicy()
    {
        $this->app->singleton(CspPolicy::class, function () {
            return new CspPolicy();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        JsonResource::withoutWrapping();
    }
}
