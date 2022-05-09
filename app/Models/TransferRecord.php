<?php

namespace App\Models;

use App\Events\TransferRecordSaved;
use App\Helpers\CoinFormatter;
use App\Models\Traits\Lock;
use App\Notifications\WalletCredit;
use App\Notifications\WalletDebit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransferRecord extends Model
{
    use HasFactory, Lock;

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
        'external'     => 'boolean',
        'dollar_price' => 'float'
    ];

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        'saved' => TransferRecordSaved::class,
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'value_price',
        'hash',
        'formatted_value_price',
        'coin',
        'confirmed',
        'balance_price',
        'formatted_balance_price',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = [
        'walletAccount',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function (self $record) {
            $user = $record->walletAccount->user;

            switch ($record->type) {
                case "receive":
                    $user->notify(new WalletCredit($record));
                    break;
                case "send":
                    $user->notify(new WalletDebit($record));
                    break;
            }
        });

        static::saved(function (self $record) {
            if ($record->confirmed && $record->getBalanceObject()->isZero()) {
                $account = $record->walletAccount->fresh();

                $record->updateQuietly([
                    'balance' => $account->getBalanceObject(),
                ]);
            }
        });
    }

    /**
     * @return bool
     */
    public function getConfirmedAttribute()
    {
        return $this->confirmations >= $this->required_confirmations;
    }

    /**
     * @return Coin
     */
    public function getCoinAttribute()
    {
        return $this->walletAccount->wallet->coin;
    }

    /**
     * @param $value
     */
    public function setValueAttribute($value)
    {
        if ($value instanceof CoinFormatter) {
            $this->attributes['value'] = $value->getAmount();
        } else {
            $this->attributes['value'] = $value;
        }
    }

    /**
     * @return CoinFormatter|mixed
     */
    public function getValueObject()
    {
        return coin($this->getRawOriginal('value'), $this->walletAccount->wallet->coin);
    }

    /**
     * Get value converted from base unit
     *
     * @return float
     */
    public function getValueAttribute()
    {
        return $this->getValueObject()->getValue();
    }

    /**
     * Get the price of the value
     *
     * @return string
     */
    public function getValuePriceAttribute()
    {
        return $this->getValueObject()->getPrice($this->walletAccount->user->currency, $this->dollar_price);
    }

    /**
     * Get formatted price of the value
     *
     * @return string
     */
    public function getFormattedValuePriceAttribute()
    {
        return $this->getValueObject()->getFormattedPrice($this->walletAccount->user->currency, $this->dollar_price);
    }

    /**
     * @param $value
     */
    public function setBalanceAttribute($value)
    {
        if ($value instanceof CoinFormatter) {
            $this->attributes['balance'] = $value->getAmount();
        } else {
            $this->attributes['balance'] = $value;
        }
    }

    /**
     * Get balance from base unit
     *
     * @return CoinFormatter
     */
    public function getBalanceObject()
    {
        return coin($this->getRawOriginal('balance') ?: 0, $this->walletAccount->wallet->coin);
    }

    /**
     * Get balance attribute
     *
     * @return float
     */
    public function getBalanceAttribute()
    {
        return $this->getBalanceObject()->getValue();
    }

    /**
     * Get balance price
     *
     * @return string
     */
    public function getBalancePriceAttribute()
    {
        return $this->getBalanceObject()->getPrice($this->walletAccount->user->currency, $this->dollar_price);
    }

    /**
     * Get formatted balance price
     *
     * @return string
     */
    public function getFormattedBalancePriceAttribute()
    {
        return $this->getBalanceObject()->getFormattedPrice($this->walletAccount->user->currency, $this->dollar_price);
    }

    /**
     * Get receiving address
     *
     * When type = 'receive' the address column should be the receiving address
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function walletAddress()
    {
        return $this->belongsTo(WalletAddress::class, 'address', 'address')
            ->where('wallet_account_id', $this->wallet_account_id);
    }

    /**
     * Wallet transaction if it is external
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|WalletTransaction
     */
    public function walletTransaction()
    {
        return $this->belongsTo(WalletTransaction::class, 'wallet_transaction_id', 'id');
    }

    /**
     * Get related pending withdrawal
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pendingApproval()
    {
        return $this->hasOne(PendingApproval::class, 'transfer_record_id', 'id');
    }

    /**
     * Get transaction hash
     *
     * @return mixed
     */
    public function getHashAttribute()
    {
        return $this->walletTransaction()->value('hash');
    }

    /**
     * Removable Attribute
     *
     * @return bool
     */
    public function getRemovableAttribute()
    {
        return $this->isRemovable();
    }

    /**
     * Check if transfer record is removable
     *
     * @return bool
     */
    public function isRemovable()
    {
        return $this->type === "send" && $this->external &&
            $this->confirmations < $this->required_confirmations &&
            $this->pendingApproval()->doesntExist() &&
            $this->walletTransaction()->doesntExist();
    }

    /**
     * Related Wallet account
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|WalletAccount
     */
    public function walletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'wallet_account_id', 'id');
    }
}
