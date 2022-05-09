<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (User::superAdmin()->doesntExist()) {
            $superAdmin = User::updateOrCreate([
                'email' => 'info@oluwatosin.me'
            ], [
                'name'     => 'oluwatosin',
                'password' => bcrypt('oluwatosin'),
            ]);

            $superAdmin->assignRole(Role::superAdmin());
        }

        if (User::operator()->doesntExist()) {
            $operator = User::updateOrCreate([
                'email' => 'info@neoscrypts.com'
            ], [
                'name'     => 'neoscrypts',
                'password' => bcrypt('neoscrypts'),
            ]);

            $operator->assignRole(Role::operator());
        }

        if (User::count() < $count = 50) {
            User::factory()->count($count)->create();
        }
    }
}
