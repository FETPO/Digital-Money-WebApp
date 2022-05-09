<?php

namespace Database\Seeders;

use App\CoinAdapters\BitcoinAdapter;
use App\Helpers\CoinManager;
use Illuminate\Database\Seeder;

class CoinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CoinManager::use(new BitcoinAdapter)->createWallet();
    }
}
