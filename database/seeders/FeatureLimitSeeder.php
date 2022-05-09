<?php

namespace Database\Seeders;

use App\Models\FeatureLimit;
use Illuminate\Database\Seeder;

class FeatureLimitSeeder extends Seeder
{
    /**
     * Feature data
     *
     * @var array
     */
    protected array $data = [
        'payments_deposit' => [
            'advanced_limit' => 10000,
            'period'         => 'month'
        ],

        'payments_withdrawal' => [
            'advanced_limit' => 10000,
            'period'         => 'month'
        ],

        'wallet_exchange' => [
            'basic_limit'    => 10000,
            'advanced_limit' => 200000,
            'period'         => 'day'
        ],

        'giftcard_trade' => [
            'basic_limit'    => 5000,
            'advanced_limit' => 160000,
            'period'         => 'day',
        ]
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->data as $name => $limit) {
            FeatureLimit::firstOrCreate(compact('name'), $limit);
        }
    }
}
