<?php

namespace App\Models;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use App\CoinAdapters\Contracts\Consolidates;
use App\CoinAdapters\Contracts\Properties;
use App\Helpers\CoinFormatter;
use App\Models\Traits\HasAdapterResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use UnexpectedValueException;

class Wallet extends Model
{
    use HasFactory, HasAdapterResource;

    protected $adapterResourceObject;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'passphrase', 'resource'
    ];

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
    protected $with = ['coin'];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::retrieved(function (self $wallet) {
            if (!$wallet->getPrice('USD')) {
                throw new UnexpectedValueException("{$wallet->coin->symbol} price cannot be zero.");
            }
        });
    }

    /**
     * Encrypt passphrase.
     *
     * @param string $value
     * @return void
     */
    public function setPassphraseAttribute($value)
    {
        $this->attributes['passphrase'] = encrypt($value);
    }

    /**
     * Decrypt passphrase.
     *
     * @param string $value
     * @return void
     */
    public function getPassphraseAttribute($value)
    {
        return decrypt($value);
    }

    /**
     * Consolidates data
     *
     * @return bool
     */
    public function getConsolidatesAttribute()
    {
        return $this->coin->adapter instanceof Consolidates;
    }

    /**
     * Check if adapter has properties
     *
     * @return array|void
     */
    public function getPropertiesAttribute()
    {
        return (!$this->coin->adapter instanceof Properties) ? null :
            $this->coin->adapter->getProperties($this->resource);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|Coin
     */
    public function coin()
    {
        return $this->belongsTo(Coin::class, 'coin_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|WalletAccount
     */
    public function accounts()
    {
        return $this->hasMany(WalletAccount::class, 'wallet_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|WalletTransaction
     */
    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class, 'wallet_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|WalletAddress
     */
    public function addresses()
    {
        return $this->hasMany(WalletAddress::class, 'wallet_id', 'id');
    }

    /**
     * Withdrawal Fee relation table
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function withdrawalFee()
    {
        return $this->hasOne(WithdrawalFee::class, 'wallet_id', 'id');
    }

    /**
     * Exchange Fee relation table
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exchangeFees()
    {
        return $this->hasMany(ExchangeFee::class, 'wallet_id', 'id');
    }

    /**
     * Check if user has wallet account.
     *
     * @param User $user
     * @return bool
     */
    public function hasAccountWithUser($user)
    {
        return $this->accounts()->where('user_id', $user->id)->exists();
    }

    /**
     * Get withdrawal fee
     *
     * @param CoinFormatter $amount
     * @return \App\Helpers\CoinFormatter
     */
    public function getWithdrawalFee(CoinFormatter $amount)
    {
        if (!$fee = $this->withdrawalFee) {
            return coin(0, $this->coin, true);
        }

        if ($fee->type != "fixed") {
            return $amount->multiply($fee->value / 100);
        } else {
            return coin($fee->value, $this->coin, true);
        }
    }

    /**
     * Get exchange fee
     *
     * @param CoinFormatter $amount
     * @param $category
     * @return CoinFormatter
     */
    public function getExchangeFee(CoinFormatter $amount, $category)
    {
        $query = $this->exchangeFees()->where('category', $category);

        if (!$fee = $query->first()) {
            return coin(0, $this->coin, true);
        }

        if ($fee->type != "fixed") {
            return $amount->multiply($fee->value / 100);
        } else {
            return coin($fee->value, $this->coin, true);
        }
    }

    /**
     * Get user's wallet account
     *
     * @param User $user
     * @return WalletAccount|mixed
     */
    public function getAccount(User $user)
    {
        return $this->accounts()
            ->where('user_id', $user->id)
            ->firstOr(function () use ($user) {
                return DB::transaction(function () use ($user) {
                    $account = new WalletAccount();

                    $account->user()->associate($user);
                    $this->accounts()->save($account);

                    $this->createAddress($account);
                    return $account->fresh();
                });
            });
    }

    /**
     * Get super admin account
     *
     * @return WalletAccount
     */
    public function operatorAccount()
    {
        if ($user = User::walletOperator()) {
            return $this->getAccount($user);
        }
    }

    /**
     * Create wallet address
     *
     * @param WalletAccount $account
     * @param string $label
     * @return WalletAddress|Model
     * @throws \Exception
     */
    public function createAddress($account)
    {
        $address = new WalletAddress();
        $label = $account->user->getWalletAddressLabel();
        $resource = $this->coin->adapter->createAddress($this->resource, $label);

        $address->fill([
            'label'    => $resource->getLabel(),
            'address'  => $resource->getAddress(),
            'resource' => $resource,
        ]);

        $address->walletAccount()->associate($account);
        $this->addresses()->save($address);
        return $address->fresh();
    }

    /**
     * Estimate transaction fee
     *
     * @param int $inputs
     * @param int $outputs
     * @param $amount
     * @return \App\Helpers\CoinFormatter
     */
    public function estimateTransactionFee(int $inputs, int $outputs, $amount = 0)
    {
        return coin($this->coin->adapter->estimateTransactionFee($inputs, $outputs, $amount, $this->min_conf), $this->coin);
    }

    /**
     * @param $address
     * @param $amount
     * @return \App\CoinAdapters\Resources\Transaction
     * @throws \Exception
     */
    public function send($address, $amount)
    {
        return $this->coin->adapter->send($this->resource, $address, $amount, $this->passphrase);
    }

    /**
     * Statistic
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function statistic()
    {
        return $this->hasOne(WalletStatistic::class, 'wallet_id', 'id');
    }

    /**
     * Get price
     *
     * @param string $currency
     * @return float|string
     */
    public function getPrice(string $currency)
    {
        return convertCurrency($this->coin->getDollarPrice(), 'USD', $currency, false, $this->coin->currency_precision);
    }

    /**
     * Get formatted price
     *
     * @param string $currency
     * @return float|string
     */
    public function getFormattedPrice(string $currency)
    {
        return convertCurrency($this->coin->getDollarPrice(), 'USD', $currency, true, $this->coin->currency_precision);
    }

    /**
     * Get price change
     *
     * @return float
     */
    public function getPriceChange()
    {
        return $this->coin->getDollarPriceChange();
    }

    /**
     * Get market chart by currency
     *
     * @param int $days
     * @param string $currency
     * @return Collection
     */
    public function marketChart(int $days, string $currency)
    {
        return collect($this->coin->getMarketChart($days))
            ->map(function ($data) use ($currency) {
                list($timestamp, $dollarPrice) = $data;

                $precision = $this->coin->getCurrencyPrecision();

                $converted = app('exchanger')->convert(
                    money($dollarPrice, 'USD', true, $precision),
                    currency($currency, $precision)
                );

                return [
                    'timestamp'       => $timestamp,
                    'price'           => $converted->getValue(),
                    'formatted_price' => $converted->format(),
                ];
            });
    }

    /**
     * Scope identifier query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeIdentifier($query, $identifier)
    {
        return $query->whereHas('coin', function ($query) use ($identifier) {
            $query->where('identifier', $identifier);
        });
    }
}
