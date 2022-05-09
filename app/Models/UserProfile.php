<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'last_name',
        'first_name',
        'dob',
        'bio',
        'picture'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'is_complete', 'full_name'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'dob' => 'datetime',
    ];

    /**
     * Get full name
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return !$this->is_complete ? "" : "$this->first_name $this->last_name";
    }

    /**
     * Get picture url
     *
     * @param $value
     * @return string
     */
    public function getPictureAttribute($value)
    {
        return $value ? url($value) : null;
    }

    /**
     * Check if profile is complete
     *
     * @return bool
     */
    public function getIsCompleteAttribute()
    {
        return !empty($this->last_name)
            && !empty($this->first_name);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
