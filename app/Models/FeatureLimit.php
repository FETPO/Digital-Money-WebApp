<?php

namespace App\Models;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeatureLimit extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'name';

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
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'title',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'unverified_limit' => 'float',
        'basic_limit'      => 'float',
        'advanced_limit'   => 'float',
    ];

    /**
     * Get title attribute
     *
     * @return string
     */
    public function getTitleAttribute()
    {
        return trans("feature.$this->name");
    }

    /**
     * Check if feature is enabled for user
     *
     * @param User $user
     * @return bool
     */
    public function enabled(User $user)
    {
        return $this->getActiveLimit($user) > 0;
    }

    /**
     * Get user's limit
     *
     * @param User $user
     * @return float
     */
    public function getActiveLimit(User $user)
    {
        $status = $user->verification()->status();
        $value = $this->{"{$status}_limit"} ?: 0;

        return $this->fromBase($value, $user);
    }

    /**
     * Get total usage
     *
     * @param User $user
     * @return float
     */
    public function getTotalUsage(User $user)
    {
        $total = $this->usages()
            ->where('user_id', $user->id)
            ->whereDate('created_at', ">=", now()->startOf($this->period))
            ->sum('value');

        return $this->fromBase($total, $user);
    }

    /**
     * Available
     *
     * @param User $user
     * @return float
     */
    public function getAvailable(User $user)
    {
        return max($this->getActiveLimit($user) - $this->getTotalUsage($user), 0);
    }

    /**
     * Parse value
     *
     * @param $value
     * @param User $user
     * @return float
     */
    protected function fromBase($value, User $user)
    {
        switch ($this->type) {
            case 'amount':
                return convertCurrency($value, 'USD', $user->currency, false);
            default:
                return $value;
        }
    }

    /**
     * Check availability
     *
     * @param Money|float $value
     * @param User $user
     * @return bool
     */
    public function checkAvailability($value, User $user)
    {
        $amount = $this->parseValue($value, $user);

        return $this->getAvailable($user) >= $amount;
    }

    /**
     * Set feature usage
     *
     * @param Money|float $value
     * @param User $user
     */
    public function setUsage($value, User $user)
    {
        $this->usages()->create([
            'value'   => $this->toBase($value, $user),
            'user_id' => $user->id,
        ]);
    }

    /**
     * Convert money to base
     *
     * @param Money|float $value
     * @param User $user
     * @return float
     */
    protected function toBase($value, User $user)
    {
        switch ($this->type) {
            case 'amount':
                return app('exchanger')->convert($value, new Currency('USD'))->getValue();
            default:
                return $value;
        }
    }

    /**
     * Validate limit value
     *
     * @param Money|float $value
     * @param User $user
     * @return float
     */
    protected function parseValue($value, User $user)
    {
        switch ($this->type) {
            case 'amount':
                return app('exchanger')->convert($value, new Currency($user->currency))->getValue();
            default:
                return $value;
        }
    }

    /**
     * Feature usage logs
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function usages()
    {
        return $this->hasMany(FeatureUsage::class, 'feature_name', 'name');
    }

    /**
     * Bank deposit
     *
     * @return self
     */
    public static function paymentsDeposit()
    {
        return self::findOrFail('payments_deposit');
    }

    /**
     * Bank Withdrawal
     *
     * @return self
     */
    public static function paymentsWithdrawal()
    {
        return self::findOrFail('payments_withdrawal');
    }

    /**
     * Wallet Exchange
     *
     * @return self
     */
    public static function walletExchange()
    {
        return self::findOrFail('wallet_exchange');
    }

    /**
     * Giftcard Trade
     *
     * @return self
     */
    public static function giftcardTrade()
    {
        return self::findOrFail('giftcard_trade');
    }
}
