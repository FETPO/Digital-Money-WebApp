<?php

namespace App\Models;

use Exception;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role as Model;

class Role extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['protected'];

    /**
     * Reserved rank
     *
     * @var int
     */
    public static int $reservedRank = 10;

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function (self $role) {
            if (!in_array($role->name, self::reservedRoles()) && self::rankReservation($role->rank)) {
                throw new Exception("The rank is reserved");
            }
        });

        static::updating(function (self $role) {
            if ($role->isDirty('name') && $role->isProtected()) {
                throw new Exception("Cannot update role.");
            }

            if ($role->isDirty('rank') && self::rankReservation($role->rank) && !$role->isProtected()) {
                throw new Exception("The rank is reserved");
            }
        });

        static::deleting(function (self $role) {
            if ($role->isProtected()) {
                throw new Exception("Cannot delete role.");
            }
        });
    }

    /**
     * Check if rank is reserved
     *
     * @param $rank
     * @return bool
     */
    public static function rankReservation($rank)
    {
        return !is_null($rank) && $rank < static::$reservedRank;
    }

    /**
     * Get protected role names
     *
     * @return array
     */
    public static function reservedRoles()
    {
        return array_values(config('permission.roles', []));
    }

    /**
     * Check if array is protected
     *
     * @return bool
     */
    public function isProtected()
    {
        return in_array($this->getOriginal('name'), self::reservedRoles());
    }

    /**
     * Protection status
     *
     * @return bool
     */
    public function getProtectedAttribute()
    {
        return $this->isProtected();
    }

    /**
     * Super admin
     *
     * @return Role
     */
    public static function superAdmin()
    {
        return Cache::remember('role.superAdmin', 10, function () {
            return self::where('name', config('permission.roles.super_admin'))->firstOrFail();
        });
    }

    /**
     * Operator
     *
     * @return Role
     */
    public static function operator()
    {
        return Cache::remember('role.operator', 10, function () {
            return self::where('name', config('permission.roles.operator'))->firstOrFail();
        });
    }
}
