<?php

namespace App\Models;

use Exception;
use Spatie\Permission\Models\Permission as Model;

class Permission extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::updating(function (self $permission) {
            if ($permission->isDirty('name')) {
                throw new Exception("Cannot update permission");
            }
        });

        static::deleting(function () {
            throw new Exception("Cannot delete permission");
        });
    }
}
