<?php

namespace App\Providers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Password;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        $this->enableImplicitPermissionGrant();
        $this->passwordValidation();
    }

    /**
     * Set Password validation rules
     *
     * @return void
     */
    protected function passwordValidation()
    {
        Password::defaults(function () {
            return Password::min(8)
                ->letters()
                ->numbers()
                ->symbols();
        });
    }

    /**
     * Enable implicit permission grant for "Super Admin" role
     *
     * @return void
     */
    protected function enableImplicitPermissionGrant()
    {
        Gate::before(function (User $user) {
            return $user->hasRole(Role::superAdmin()) ?: null;
        });
    }
}
