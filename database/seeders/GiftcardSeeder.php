<?php

namespace Database\Seeders;

use App\Models\Giftcard;
use App\Models\GiftcardBrand;
use Illuminate\Database\Seeder;

class GiftcardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (app()->environment('local')) {
            $giftcards = Giftcard::factory()
                ->hasContents(5)->count(300);

            GiftcardBrand::factory()
                ->has($giftcards, 'giftcards')
                ->count(1)->create();
        }
    }
}
