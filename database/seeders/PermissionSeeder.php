<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * List of permissions
     *
     * @var array
     */
    protected array $permissions = [
        'access_control_panel',
        'manage_wallets',
        'manage_payments',
        'manage_banks',
        'manage_giftcards',
        'manage_exchange',
        'view_users',
        'update_users',
        'verify_users',
        'manage_localization',
        'manage_customization',
        'manage_settings',
    ];

    /**
     * List of roles and their levels
     *
     * @var array
     */
    protected array $roles = [
        [
            'name'        => 'Super Admin',
            'rank'        => 1,
            'permissions' => [],
        ],
        [
            'name'        => 'Operator',
            'rank'        => 2,
            'permissions' => [
                'access_control_panel'
            ],
        ]
    ];

    /**
     * Seed Permissions Table
     *
     * @return void
     */
    protected function seedPermissions()
    {
        collect($this->permissions)->each(function ($name) {
            Permission::firstOrCreate(compact('name'));
        });
    }

    /**
     * Seed roles table
     *
     * @return void
     */
    protected function seedRoles()
    {
        collect($this->roles)->each(function ($data) {
            $role = Role::updateOrCreate([
                'name' => $data['name'],
            ], [
                'rank' => $data['rank']
            ]);
            $role->syncPermissions($data['permissions']);
        });
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->seedPermissions();
        $this->seedRoles();
    }
}
