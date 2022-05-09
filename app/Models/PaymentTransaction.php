<?php

namespace App\Models;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use App\Events\PaymentTransactionSaved;
use App\Models\Traits\Lock;
use App\Models\Traits\Uuid;
use App\Notifications\PaymentCredit;
use App\Notifications\PaymentDebit;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use UnexpectedValueException;

class PaymentTransaction extends Model
{
    use HasFactory, Uuid, Lock;

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
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['account'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'formatted_value',
        'formatted_balance'
    ];

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        'saved' => PaymentTransactionSaved::class
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::saved(function (self $record) {
            $user = $record->account->user;

            if ($record->isDirty('status') && $record->isCompleted()) {
                switch ($record->type) {
                    case "receive":
                        $user->notify(new PaymentCredit($record));
                        break;
                    case "send":
                        $user->notify(new PaymentDebit($record));
                        break;
                }
            }
        });

        static::saved(function (self $record) {
            if ($record->isCompleted() && $record->getBalanceObject()->isZero()) {
                $account = $record->account->fresh();

                $record->updateQuietly([
                    'balance' => $account->getBalanceObject(),
                ]);
            }
        });
    }

    /**
     * Set base value from money object
     *
     * @param Money $value
     */
    public function setValueAttribute(Money $value)
    {
        $this->attributes['value'] = $value->getAmount();
    }

    /**
     * Get value object
     *
     * @return Money
     */
    public function getValueObject()
    {
        return new Money($this->getRawOriginal('value'), new Currency($this->account->currency));
    }

    /**
     * Get value attribute
     *
     * @return float
     */
    public function getValueAttribute()
    {
        return $this->getValueObject()->getValue();
    }

    /**
     * Get formatted value
     *
     * @return string
     */
    public function getFormattedValueAttribute()
    {
        return $this->getValueObject()->format();
    }

    /**
     * Set base value from money object
     *
     * @param Money $value
     */
    public function setBalanceAttribute(Money $value)
    {
        $this->attributes['balance'] = $value->getAmount();
    }

    /**
     * Get balance object
     *
     * @return Money
     */
    public function getBalanceObject()
    {
        return new Money($this->getRawOriginal('balance') ?: 0, new Currency($this->account->currency));
    }

    /**
     * Get balance
     *
     * @return float
     */
    public function getBalanceAttribute()
    {
        return $this->getBalanceObject()->getValue();
    }

    /**
     * Get formatted balance
     *
     * @return string
     */
    public function getFormattedBalanceAttribute()
    {
        return $this->getBalanceObject()->format();
    }

    /**
     * Complete gateway
     *
     * @return bool|void
     * @throws Exception
     */
    public function completeGateway()
    {
        return $this->acquireLock(function (self $record) {
            if (!$record->isPendingGateway() || $record->type !== "receive") {
                throw new Exception("Transaction is not a pending gateway.");
            }

            $gateway = app('multipay')->gateway($record->gateway_name);
            $value = $record->getValueObject();

            if ($gateway->verify($record->gateway_ref)) {
                FeatureLimit::paymentsDeposit()->setUsage($value, $record->account->user);
                return $record->update(['status' => 'completed']);
            }
        });
    }

    /**
     * Complete transfer
     *
     * @return bool
     * @throws Exception
     */
    public function completeTransfer()
    {
        return $this->acquireLock(function (self $record) {
            if (!$record->isPendingTransfer()) {
                throw new Exception("Transaction is not pending.");
            }

            $value = $record->getValueObject();

            switch ($record->type) {
                case "receive":
                    FeatureLimit::paymentsDeposit()->setUsage($value, $record->account->user);
                    break;
                case "send":
                    FeatureLimit::paymentsWithdrawal()->setUsage($value, $record->account->user);
                    break;
            }

            return $record->update(['status' => 'completed']);
        });
    }

    /**
     * Check if transaction is completed
     *
     * @return bool
     */
    public function isCompleted()
    {
        return $this->status === "completed";
    }

    /**
     * Check if transaction is pending
     *
     * @return bool
     */
    public function isPending()
    {
        return in_array($this->status, ["pending-gateway", "pending-transfer"]);
    }

    /**
     * Check pending gateway
     *
     * @return bool
     */
    public function isPendingGateway()
    {
        return $this->status === "pending-gateway";
    }

    /**
     * Check pending transfer
     *
     * @return bool
     */
    public function isPendingTransfer()
    {
        return $this->status === "pending-transfer";
    }

    /**
     * Check if it is overdue
     *
     * @return bool
     */
    public function isPendingOverdue()
    {
        return $this->isPending() && $this->created_at->addHours(3) < now();
    }

    /**
     * Cancel transaction
     *
     * @return bool
     * @throws Exception
     */
    public function cancelPending()
    {
        return $this->acquireLock(function (self $record) {
            if (!$record->isPending()) {
                throw new Exception("Transaction is not pending.");
            }

            return $record->update(['status' => 'canceled']);
        });
    }

    /**
     * Get payment account
     *
     * @return BelongsTo
     */
    public function account()
    {
        return $this->belongsTo(PaymentAccount::class, 'payment_account_id', 'id');
    }

    /**
     * Scope pending query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopePending($query)
    {
        return $query->whereIn('status', ['pending-transfer', 'pending-gateway']);
    }

    /**
     * Scope pending transfer query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopePendingTransfer($query)
    {
        return $query->where('status', 'pending-transfer');
    }

    /**
     * Scope pending gateway query
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopePendingGateway($query)
    {
        return $query->where('status', 'pending-gateway');
    }
}
