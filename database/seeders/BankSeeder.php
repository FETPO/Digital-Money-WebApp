<?php

namespace Database\Seeders;

use App\Models\Bank;
use App\Models\BankAccount;
use App\Models\OperatingCountry;
use App\Models\SupportedCurrency;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * @var array|string[]
     */
    protected array $list = [
        'Access Bank'           => 'NG',
        'Guarantee Trust Bank'  => 'NG',
        'First Bank'            => 'NG',
        'United Bank of Africa' => 'NG',
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        collect($this->list)
            ->map(function ($countries, $name) {
                $countries = collect(explode(",", $countries))
                    ->map(function ($country) {
                        return strtoupper($country);
                    })
                    ->filter(function ($country) {
                        return OperatingCountry::where('code', $country)->exists();
                    })
                    ->toArray();

                if (count($countries)) {
                    $bank = Bank::firstOrcreate(compact('name'));
                    return tap($bank, function ($bank) use ($countries) {
                        $bank->operatingCountries()->sync($countries);
                    });
                }
            })->filter();
    }
}
