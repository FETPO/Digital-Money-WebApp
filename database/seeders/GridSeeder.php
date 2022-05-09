<?php

namespace Database\Seeders;

use App\Models\Grid;
use Illuminate\Database\Seeder;

class GridSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->seedIndexHomePage();
        $this->seedAdminHomePage();
    }

    /**
     * Send Index Home Page
     *
     * @return void
     */
    protected function seedIndexHomePage()
    {
        $data = [
            'price_chart',
            'payment_account_chart',
            'wallet_account_chart',
            'recent_activity',
            'feature_limits',
        ];

        foreach ($data as $order => $name) {
            Grid::updateOrCreate([
                'page' => 'index.home',
                'name' => $name,
            ], [
                'order' => $order
            ]);
        }
    }

    /**
     * Send Admin Home Page
     *
     * @return void
     */
    protected function seedAdminHomePage()
    {
        $data = [
            'pending_verification',
            'pending_deposits',
            'pending_withdrawals',
            'earning_summary',
            'system_status',
            'registration_chart',
            'latest_users',
        ];

        foreach ($data as $order => $name) {
            Grid::updateOrCreate([
                'page' => 'admin.home',
                'name' => $name,
            ], [
                'order' => $order
            ]);
        }
    }
}
