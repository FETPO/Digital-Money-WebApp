<?php

namespace App\Models;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use App\Events\ExchangeTradeSaved;
use App\Exceptions\TransferException;
use App\Helpers\CoinFormatter;
use App\Models\Traits\Lock;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ExchangeTrade extends Model
{
    use HasFactory, Lock;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'completed_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'completed_at' => 'datetime',
        'dollar_price' => 'float'
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['walletAccount', 'paymentAccount', 'trader'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'wallet_value_price',
        'formatted_wallet_value_price',
        'coin',
        'payment_currency',
        'formatted_payment_value',
        'payment_symbol'
    ];

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        'saved' => ExchangeTradeSaved::class
    ];

    /**
     * Set payment value from money object
     *
     * @param Money $value
     */
    public function setPaymentValueAttribute(Money $value)
    {
        $this->attributes['payment_value'] = $value->getAmount();
    }

    /**
     * Payment Value Object
     *
     * @return Money
     */
    public function getPaymentValueObject()
    {
        return new Money($this->getRawOriginal('payment_value'), new Currency($this->paymentAccount->currency));
    }

    /**
     * Payment Value
     *
     * @return float
     */
    public function getPaymentValueAttribute()
    {
        return $this->getPaymentValueObject()->getValue();
    }

    /**
     * Get formatted payment value
     *
     * @return string
     */
    public function getFormattedPaymentValueAttribute()
    {
        return $this->getPaymentValueObject()->format();
    }

    /**
     * Related payment account
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paymentAccount()
    {
        return $this->belongsTo(PaymentAccount::class, 'payment_account_id', 'id');
    }

    /**
     * Set fee value attribute
     *
     * @param CoinFormatter $value
     */
    public function setFeeValueAttribute(CoinFormatter $value)
    {
        $this->attributes['fee_value'] = $value->getAmount();
    }

    /**
     * Get fee value object
     *
     * @return CoinFormatter
     */
    public function getFeeValueObject()
    {
        return coin($this->getRawOriginal('fee_value'), $this->walletAccount->wallet->coin);
    }

    /**
     * Get fee value attribute
     *
     * @return float
     */
    public function getFeeValueAttribute()
    {
        return $this->getFeeValueObject()->getValue();
    }

    /**
     * Set wallet value from coin formatter
     *
     * @param CoinFormatter $value
     */
    public function setWalletValueAttribute(CoinFormatter $value)
    {
        $this->attributes['wallet_value'] = $value->getAmount();
    }

    /**
     * Get wallet value coin object
     *
     * @return CoinFormatter
     */
    public function getWalletValueObject()
    {
        return coin($this->getRawOriginal('wallet_value'), $this->walletAccount->wallet->coin);
    }

    /**
     * @return float
     */
    public function getWalletValueAttribute()
    {
        return $this->getWalletValueObject()->getValue();
    }

    /**
     * Price of wallet value in payment currency
     *
     * @return float|string
     */
    public function getWalletValuePriceAttribute()
    {
        return $this->getWalletValueObject()->getPrice($this->paymentAccount->currency, $this->dollar_price);
    }

    /**
     * @return string
     */
    public function getFormattedWalletValuePriceAttribute()
    {
        return $this->getWalletValueObject()->getFormattedPrice($this->paymentAccount->currency, $this->dollar_price);
    }

    /**
     * Related wallet account
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function walletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'wallet_account_id', 'id');
    }

    /**
     * Get coin attribute
     *
     * @return Coin
     */
    public function getCoinAttribute()
    {
        return $this->walletAccount->wallet->coin;
    }

    /**
     * Get payment currency
     *
     * @return mixed|string
     */
    public function getPaymentCurrencyAttribute()
    {
        return $this->paymentAccount->currency;
    }

    /**
     * Get payment symbol
     *
     * @return mixed|string
     */
    public function getPaymentSymbolAttribute()
    {
        return $this->paymentAccount->symbol;
    }

    /**
     * Trader object
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function trader()
    {
        return $this->belongsTo(User::class, 'trader_id', 'id');
    }

    /**
     * Complete pending buy
     *
     * @return ExchangeTrade|mixed
     */
    public function completePendingBuy()
    {
        return $this->paymentAccount->acquireLock(function () {
            return $this->acquireLock(function (self $record) {
                if ($record->type !== "buy" || $record->status !== "pending") {
                    throw new Exception("Trade is not pending.");
                }

                $traderAccount = $record->walletAccount->wallet->getAccount($record->trader);

                return $traderAccount->acquireLock(function (WalletAccount $traderAccount) use ($record) {
                    return DB::transaction(function () use ($record, $traderAccount) {
                        $limit = FeatureLimit::walletExchange();
                        $amount = $record->getWalletValueObject();

                        if ($traderAccount->getAvailableObject()->lessThan($amount)) {
                            throw new TransferException(trans('wallet.insufficient_trader_available'));
                        }

                        $description = $record->transferDescription();
                        $payment = $record->getPaymentValueObject();

                        $traderAccount->debit($amount, $description, $record->dollar_price);
                        $record->walletAccount->credit($amount, $description, $record->dollar_price);

                        $record->paymentAccount->debit($payment, $description);
                        $traderPayment = $record->trader->getPaymentAccountByCurrency($record->paymentAccount->currency);
                        $traderPayment->credit($payment, $description);

                        Earning::wallet($record->getFeeValueObject(), $description, $record->trader);
                        $limit->setUsage($payment, $record->paymentAccount->user);

                        $record->fill(['status' => 'completed', 'completed_at' => now()]);
                        return tap($record)->save();
                    });
                });
            });
        });
    }

    /**
     * Canceled pending
     *
     * @return void|ExchangeTrade
     */
    public function cancelPending()
    {
        return $this->acquireLock(function (self $record) {
            if ($record->status !== "pending") {
                throw new Exception("Trade is not pending.");
            }

            $record->fill(['status' => 'canceled']);
            return tap($record)->save();
        });
    }

    /**
     * Get transfer description
     *
     * @return string
     */
    public function transferDescription()
    {
        return trans("wallet.exchange_{$this->type}", [
            'coin'  => $this->coin->name,
            'price' => $this->formatted_payment_value
        ]);
    }
}
