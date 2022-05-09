<?php

namespace Database\Seeders;

use Akaunting\Money\Currency;
use App\Models\SupportedCurrency;
use Illuminate\Database\Seeder;

class SupportedCurrencySeeder extends Seeder
{
    /**
     * Set default supported currencies
     *
     * @var array|string[]
     */
    protected array $supported = ['USD', 'NGN', 'EUR', 'GBP'];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!SupportedCurrency::default()->exists()) {
            collect($this->supported)->each(function ($code) {
                $currency = new Currency($code);

                SupportedCurrency::updateOrCreate([
                    'code' => strtoupper($code)
                ], [
                    'default' => strtoupper($code) == 'USD',
                    'name'    => $currency->getName(),
                ]);
            });
        }
    }
}
