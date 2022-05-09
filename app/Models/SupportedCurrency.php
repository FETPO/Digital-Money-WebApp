<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class SupportedCurrency extends Model
{
    use HasFactory;

    protected $exchangeRate;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'code';

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'default' => 'boolean'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'exchange_rate',
        'exchange_type',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function (self $record) {
            $record->code = strtoupper($record->code);
        });

        static::deleting(function (self $record) {
            if ($record->default) {
                throw new Exception("Cannot delete default");
            }
        });
    }

    /**
     * Scope default query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDefault($query)
    {
        return $query->oldest()->where('default', true);
    }

    /**
     * Related payment accounts
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function paymentAccounts()
    {
        return $this->hasMany(PaymentAccount::class, 'currency', 'code');
    }

    /**
     * Statistics
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function statistic()
    {
        return $this->hasOne(SupportedCurrencyStatistic::class, 'supported_currency_code', 'code');
    }

    /**
     * Exchange rate
     *
     * @return array
     */
    protected function exchangeRate()
    {
        if (!isset($this->exchangeRate)) {
            $this->exchangeRate = app('exchanger')->getDriver()->find($this->code);
        }
        return $this->exchangeRate;
    }

    /**
     * Get exchange rate
     *
     * @return float|string
     */
    public function getExchangeRateAttribute()
    {
        return Arr::get($this->exchangeRate(), 'exchange_rate');
    }

    /**
     * Exchange type, auto|manual
     *
     * @return string
     */
    public function getExchangeTypeAttribute()
    {
        return Arr::get($this->exchangeRate(), 'type');
    }
}
