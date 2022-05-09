<?php

namespace Database\Seeders;

use App\Models\OperatingCountry;
use Illuminate\Database\Seeder;

class OperatingCountrySeeder extends Seeder
{
    /**
     * Set default operating countries
     *
     * @var array|string[]
     */
    protected array $supported = [
        'NG', 'US', 'GB', 'CN'
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        collect($this->supported)->each(function ($code) {
            OperatingCountry::updateOrCreate([
                'code' => $code
            ], [
                'name' => config("countries.$code"),
            ]);
        });
    }
}
