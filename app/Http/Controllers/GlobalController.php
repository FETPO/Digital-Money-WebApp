<?php

namespace App\Http\Controllers;

use Akaunting\Money\Currency;
use App\Http\Resources\OperatingCountryResource;
use App\Http\Resources\SupportedCurrencyResource;
use App\Http\Resources\WalletResource;
use App\Models\OperatingCountry;
use App\Models\SupportedCurrency;
use App\Models\Wallet;

class GlobalController extends Controller
{
    /**
     * Get supported currencies.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function supportedCurrencies()
    {
        return SupportedCurrencyResource::collection(SupportedCurrency::all());
    }

    /**
     * Get operating countries
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function operatingCountries()
    {
        return OperatingCountryResource::collection(OperatingCountry::all());
    }

    /**
     * Get array of wallets
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function wallets()
    {
        return WalletResource::collection(Wallet::all());
    }

    /**
     * Get array of countries
     *
     * @return array
     */
    public function countries()
    {
        return collect(config('countries'))
            ->map(function ($name, $code) {
                return compact('name', 'code');
            })->values()->toArray();
    }
}
