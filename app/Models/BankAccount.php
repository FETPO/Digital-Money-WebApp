<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'bank_name',
        'beneficiary',
        'number',
        'currency',
        'country',
        'note'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'bank_logo',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['bank', 'user'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['user'];

    /**
     * Get related bank
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function bank()
    {
        return $this->belongsTo(Bank::class, 'bank_id', 'id');
    }

    /**
     * Get bank logo
     *
     * @return string|null
     */
    public function getBankLogoAttribute()
    {
        return $this->bank?->logo;
    }

    /**
     * Get referenced user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Beneficiary name
     *
     * @param $value
     * @return string
     */
    public function getBeneficiaryAttribute($value)
    {
        return !$this->user ? $value : $this->user->profile->full_name;
    }

    /**
     * Bank name
     *
     * @param $value
     * @return string
     */
    public function getBankNameAttribute($value)
    {
        return !$this->bank ? $value : $this->bank->name;
    }

    /**
     * Filter by country.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $code
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCountry($query, $code)
    {
        return $query->where('country', strtoupper($code));
    }

    /**
     * Filter by currency.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $code
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCurrency($query, $code)
    {
        return $query->where('currency', strtoupper($code));
    }

    /**
     * Supported currency
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function supportedCurrency()
    {
        return $this->belongsTo(SupportedCurrency::class, 'currency', 'code');
    }

    /**
     * Get transfer description
     *
     * @return string
     */
    public function transferDescription()
    {
        return substr("transfer: $this->number ($this->bank_name)", 0, 250);
    }
}
