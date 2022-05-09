<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * Get path for logo
     *
     * @return string
     */
    public function path()
    {
        return "banks/{$this->id}";
    }

    /**
     * Get logo url
     *
     * @param $value
     * @return string
     */
    public function getLogoAttribute($value)
    {
        return $value ? url($value) : null;
    }

    /**
     * Bank accounts relation
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function accounts()
    {
        return $this->hasMany(BankAccount::class, 'bank_id', 'id');
    }

    /**
     * Related operating countries
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function operatingCountries()
    {
        return $this->belongsToMany(OperatingCountry::class, 'operating_country_bank', 'bank_id', 'operating_country_code')
            ->withTimestamps();
    }

    /**
     * Filter by country.
     *
     * @param Builder $query
     * @param string $code
     * @return Builder
     */
    public function scopeCountry($query, $code)
    {
        return $query->whereHas('operatingCountries', function (Builder $query) use ($code) {
            $query->where('code', strtoupper($code));
        });
    }
}
