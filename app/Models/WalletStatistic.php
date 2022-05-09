<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletStatistic extends Model
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
    protected $with = ['wallet'];

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
        'balance_on_trade_price',
        'formatted_balance_on_trade_price',
        'balance_price',
        'formatted_balance_price',
    ];

    /**
     * Get balance on trade coin object
     *
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getBalanceOnTradeObject()
    {
        return coin($this->balance_on_trade, $this->wallet->coin, true);
    }

    /**
     * Balance on trade price
     *
     * @return string
     */
    public function getBalanceOnTradePriceAttribute()
    {
        return $this->getBalanceOnTradeObject()->getPrice(defaultCurrency());
    }

    /**
     * @return string
     */
    public function getFormattedBalanceOnTradePriceAttribute()
    {
        return $this->getBalanceOnTradeObject()->getFormattedPrice(defaultCurrency());
    }

    /**
     * Get balance coin object
     *
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getBalanceObject()
    {
        return coin($this->balance, $this->wallet->coin, true);
    }

    /**
     * Get balance price
     *
     * @return string
     */
    public function getBalancePriceAttribute()
    {
        return $this->getBalanceObject()->getPrice(defaultCurrency());
    }

    /**
     * Get formatted balance price
     *
     * @return string
     */
    public function getFormattedBalancePriceAttribute()
    {
        return $this->getBalanceObject()->getFormattedPrice(defaultCurrency());
    }

    /**
     * Related wallet
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|Wallet
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }
}
