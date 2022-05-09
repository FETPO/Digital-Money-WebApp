<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:' . config('permission.roles.super_admin'));
    }

    /**
     * Get all roles
     *
     * @return Role[]
     */
    public function all()
    {
        return $this->roles()->get();
    }

    /**
     * Paginated records
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate()
    {
        return paginate($this->roles()->with('permissions')->withCount('users'));
    }

    /**
     * Get all permissions
     *
     * @return Permission[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getPermissions()
    {
        return $this->permissions()->get();
    }

    /**
     * Update role
     *
     * @param Request $request
     * @param Role $role
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request, Role $role)
    {
        $allowedPermissions = $this->permissions()->get()->pluck('name');

        if (!$role->isProtected()) {
            $validated = $this->validate($request, [
                'name' => ['required', 'string', 'max:100', Rule::unique('roles')->ignore($role)],
                'rank' => ['required', 'integer', 'min:' . Role::$reservedRank],
            ]);

            $role->fill($validated);
        }

        $relation = $this->validate($request, [
            'permissions' => 'array:' . $allowedPermissions->implode(",")
        ]);

        $permissions = collect(Arr::get($relation, 'permissions'))->filter();

        $role->syncPermissions($permissions->keys()->all())->save();
    }

    /**
     * Delete role
     *
     * @param Role $role
     */
    public function delete(Role $role)
    {
        if ($role->isProtected()) {
            return abort(403, trans('auth.action_forbidden'));
        } else {
            $role->delete();
        }
    }

    /**
     * Create new role
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function create(Request $request)
    {
        $allowedPermissions = $this->permissions()->get()->pluck('name');

        $data = $this->validate($request, [
            'rank' => ['required', 'integer', 'min:' . Role::$reservedRank],
            'name' => ['required', 'string', 'max:100', 'unique:roles'],
        ]);

        $role = Role::create($data);

        $relation = $this->validate($request, [
            'permissions' => 'array:' . $allowedPermissions->implode(",")
        ]);

        $permissions = collect(Arr::get($relation, 'permissions'))->filter();

        $role->syncPermissions($permissions->keys()->all());
    }

    /**
     * Assign roles to user
     *
     * @param Request $request
     * @param $user
     */
    public function assign(Request $request, $user)
    {
        $subject = Auth::user()->subordinates()->findOrFail($user);

        $validated = $request->validate([
            'roles'   => 'array',
            'roles.*' => [Rule::in($this->roles()->get()->pluck('name'))]
        ]);

        $subject->syncRoles(Arr::get($validated, 'roles'));
    }

    /**
     * Permissions query
     *
     * @return Permission|\Illuminate\Database\Eloquent\Builder
     */
    protected function permissions()
    {
        return Permission::query();
    }

    /**
     * Role query
     *
     * @return Role|\Illuminate\Database\Eloquent\Builder
     */
    protected function roles()
    {
        return Role::latest()->whereKeyNot(Role::superAdmin()->getKey());
    }
}
