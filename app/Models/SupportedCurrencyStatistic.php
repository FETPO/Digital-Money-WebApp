<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportedCurrencyStatistic extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['supportedCurrency'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'balance'          => 'float',
        'balance_on_trade' => 'float',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'formatted_balance',
        'formatted_balance_on_trade',
    ];

    /**
     * Formatted balance
     *
     * @return string
     */
    public function getFormattedBalanceAttribute()
    {
        return formatCurrency($this->balance, $this->supportedCurrency->code);
    }

    /**
     * Formatted balance on trade
     *
     * @return string
     */
    public function getFormattedBalanceOnTradeAttribute()
    {
        return formatCurrency($this->balance_on_trade, $this->supportedCurrency->code);
    }

    /**
     * Related supported currency
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function supportedCurrency()
    {
        return $this->belongsTo(SupportedCurrency::class, 'supported_currency_code', 'code');
    }
}
