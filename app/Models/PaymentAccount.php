<?php

namespace App\Models;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use App\Exceptions\TransferException;
use App\Models\Traits\Lock;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use UnexpectedValueException;

class PaymentAccount extends Model
{
    use HasFactory, Lock;

    protected $minTransferableObject;
    protected $maxTransferableObject;
    protected $balanceAttribute;
    protected $balanceObject;
    protected $balanceOnTradeAttribute;
    protected $balanceOnTradeObject;
    protected $availableAttribute;
    protected $availableObject;
    protected $totalReceivedAttribute;
    protected $totalReceivedObject;
    protected $totalPendingReceiveAttribute;
    protected $totalPendingReceiveObject;
    protected $totalSentAttribute;
    protected $totalSentObject;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reference',
        'currency'
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['user'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['user'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'balance_on_trade',
        'formatted_balance_on_trade',
        'balance',
        'formatted_balance',
        'available',
        'formatted_available',
        'total_pending_receive',
        'formatted_total_pending_receive',
        'total_received',
        'formatted_total_received',
        'total_sent',
        'formatted_total_sent',
        'symbol',
        'min_transferable',
        'max_transferable',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function (self $record) {
            $record->assignReference();
        });
    }

    /**
     * Cast base value to money
     *
     * @param $amount
     * @param false $convert
     * @return Money
     */
    protected function castMoney($amount, $convert = false)
    {
        return new Money($amount, new Currency($this->currency), $convert);
    }

    /**
     * Parse money from input
     *
     * @param $inputAmount
     * @return Money
     */
    public function parseMoney($inputAmount)
    {
        return $this->castMoney($inputAmount, true);
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
     * Get payment transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions()
    {
        return $this->hasMany(PaymentTransaction::class, 'payment_account_id', 'id');
    }

    /**
     * Assign unique reference
     *
     * @return void
     */
    protected function assignReference()
    {
        while (!$this->isUniqueReference($this->reference)) {
            $this->reference = strtoupper(Str::random(10));
        }
    }

    /**
     * Check if reference is unique
     *
     * @return bool
     */
    protected function isUniqueReference($reference)
    {
        return $reference && !static::withoutGlobalScopes()
                ->where('reference', $reference)->exists();
    }

    /**
     * Min Transferable Object
     *
     * @return Money
     */
    public function getMinTransferableObject()
    {
        if (!isset($this->minTransferableObject)) {
            $value = Money::USD(settings()->get('min_payment'), true);
            $this->minTransferableObject = exchanger($value, new Currency($this->currency));
        }
        return $this->minTransferableObject;
    }

    /**
     * Min Transferable
     *
     * @return float
     */
    public function getMinTransferableAttribute()
    {
        return $this->getMinTransferableObject()->getValue();
    }

    /**
     * Max Transferable Object
     *
     * @return Money
     */
    public function getMaxTransferableObject()
    {
        if (!isset($this->maxTransferableObject)) {
            $value = Money::USD(settings()->get('max_payment'), true);
            $this->maxTransferableObject = exchanger($value, new Currency($this->currency));
        }
        return $this->maxTransferableObject;
    }

    /**
     * Max Transferable
     *
     * @return float
     */
    public function getMaxTransferableAttribute()
    {
        return $this->getMaxTransferableObject()->getValue();
    }

    /**
     * Available Object
     *
     * @return Money
     */
    public function getAvailableObject()
    {
        if (!isset($this->availableObject)) {
            $this->availableObject = $this->getBalanceObject()->subtract($this->getBalanceOnTradeObject());
        }
        return $this->availableObject;
    }

    /**
     * Available
     *
     * @return float
     */
    public function getAvailableAttribute()
    {
        if (!isset($this->availableAttribute)) {
            $this->availableAttribute = $this->getAvailableObject()->getValue();
        }
        return $this->availableAttribute;
    }

    /**
     * Formatted available
     *
     * @return mixed
     */
    public function getFormattedAvailableAttribute()
    {
        return $this->getAvailableObject()->format();
    }

    /**
     * Balance On Trade Object
     *
     * @return Money
     */
    public function getBalanceOnTradeObject()
    {
        if (!isset($this->balanceOnTradeObject)) {
            $exchangeTrade = $this->exchangeTrades()
                ->where('type', 'buy')->where('status', 'pending')
                ->sum('payment_value');

            $this->balanceOnTradeObject = $this->castMoney($exchangeTrade);
        }
        return $this->balanceOnTradeObject;
    }

    /**
     * Balance On Trade
     *
     * @return float
     */
    public function getBalanceOnTradeAttribute()
    {
        if (!isset($this->balanceOnTradeAttribute)) {
            $this->balanceOnTradeAttribute = $this->getBalanceOnTradeObject()->getValue();
        }
        return $this->balanceOnTradeAttribute;
    }

    /**
     * Formatted balance on trade
     *
     * @return string
     */
    public function getFormattedBalanceOnTradeAttribute()
    {
        return $this->getBalanceOnTradeObject()->format();
    }

    /**
     * Balance Object
     *
     * @return Money
     */
    public function getBalanceObject()
    {
        if (!isset($this->balanceObject)) {
            $this->balanceObject = $this->getTotalReceivedObject()->subtract($this->getTotalSentObject());
        }
        return $this->balanceObject;
    }

    /**
     * Balance
     *
     * @return float
     */
    public function getBalanceAttribute()
    {
        if (!isset($this->balanceAttribute)) {
            $this->balanceAttribute = $this->getBalanceObject()->getValue();
        }
        return $this->balanceAttribute;
    }

    /**
     * Get formatted balance object
     *
     * @return string
     */
    public function getFormattedBalanceAttribute()
    {
        return $this->getBalanceObject()->format();
    }

    /**
     * Total sent query
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    protected function totalSentQuery()
    {
        return $this->transactions()
            ->where('status', '!=', 'canceled')
            ->where('type', 'send');
    }

    /**
     * Total Sent object
     *
     * @return Money
     */
    public function getTotalSentObject()
    {
        if (!isset($this->totalSentObject)) {
            $total = $this->totalSentQuery()->sum('value');
            $this->totalSentObject = $this->castMoney($total);
        }
        return $this->totalSentObject;
    }

    /**
     * Total Sent
     *
     * @return float
     */
    public function getTotalSentAttribute()
    {
        if (!isset($this->totalSentAttribute)) {
            $this->totalSentAttribute = $this->getTotalSentObject()->getValue();
        }
        return $this->totalSentAttribute;
    }

    /**
     * Format total sent
     *
     * @return string
     */
    public function getFormattedTotalSentAttribute()
    {
        return $this->getTotalSentObject()->format();
    }

    /**
     * Total received query
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    protected function totalReceivedQuery()
    {
        return $this->transactions()
            ->where('status', 'completed')
            ->where('type', 'receive');
    }

    /**
     * Total Received Object
     *
     * @return Money
     */
    public function getTotalReceivedObject()
    {
        if (!isset($this->totalReceivedObject)) {
            $total = $this->totalReceivedQuery()->sum('value');
            $this->totalReceivedObject = $this->castMoney($total);
        }
        return $this->totalReceivedObject;
    }

    /**
     * Total received
     *
     * @return float
     */
    public function getTotalReceivedAttribute()
    {
        if (!isset($this->totalReceivedAttribute)) {
            $this->totalReceivedAttribute = $this->getTotalReceivedObject()->getValue();
        }
        return $this->totalReceivedAttribute;
    }

    /**
     * Get formatted Total received.
     *
     * @return string
     */
    public function getFormattedTotalReceivedAttribute()
    {
        return $this->getTotalReceivedObject()->format();
    }

    /**
     * Total pending receive query
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    protected function totalPendingReceiveQuery()
    {
        return $this->transactions()
            ->whereIn('status', ['pending-transfer', 'pending-gateway'])
            ->where('type', 'receive');
    }

    /**
     * Has maximum pending
     *
     * @return bool
     */
    public function hasMaximumPending()
    {
        return $this->totalPendingReceiveQuery()->count() > 2;
    }

    /**
     * Total pending receive object
     *
     * @return Money
     */
    public function getTotalPendingReceiveObject()
    {
        if (!isset($this->totalPendingReceiveObject)) {
            $this->totalPendingReceiveObject = $this->castMoney(
                $this->totalPendingReceiveQuery()->sum('value')
            );
        }
        return $this->totalPendingReceiveObject;
    }

    /**
     * Total pending receive
     *
     * @return float
     */
    public function getTotalPendingReceiveAttribute()
    {
        if (!isset($this->totalPendingReceiveAttribute)) {
            $this->totalPendingReceiveAttribute = $this->getTotalPendingReceiveObject()->getValue();
        }
        return $this->totalPendingReceiveAttribute;
    }

    /**
     * Get formatted total pending receive.
     *
     * @return string
     */
    public function getFormattedTotalPendingReceiveAttribute()
    {
        return $this->getTotalPendingReceiveObject()->format();
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
     * Related exchange trades
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exchangeTrades()
    {
        return $this->hasMany(ExchangeTrade::class, 'payment_account_id', 'id');
    }

    /**
     * Get symbol attribute
     *
     * @return string
     */
    public function getSymbolAttribute()
    {
        return (new Currency($this->currency))->getSymbol();
    }

    /**
     * Credit account
     *
     * @param Money $amount
     * @param $description
     * @return PaymentTransaction|Model
     */
    public function credit(Money $amount, $description)
    {
        $value = $this->validateAmount($amount);

        return $this->transactions()->create([
            'type'        => 'receive',
            'status'      => 'completed',
            'description' => $description,
            'value'       => $value
        ]);
    }

    /**
     * Debit account
     *
     * @param Money $amount
     * @param $description
     * @return PaymentTransaction|Model
     */
    public function debit(Money $amount, $description)
    {
        $value = $this->validateAmount($amount);

        return $this->transactions()->create([
            'type'        => 'send',
            'status'      => 'completed',
            'description' => $description,
            'value'       => $value
        ]);
    }

    /**
     * Create withdrawal request
     *
     * @param Money $amount
     * @param BankAccount $bankAccount
     * @return PaymentTransaction
     */
    public function sendViaTransfer(Money $amount, BankAccount $bankAccount)
    {
        $value = $this->validateAmount($amount);

        return $this->acquireLock(function (self $account) use ($value, $bankAccount) {
            if ($account->getAvailableObject()->lessThan($value)) {
                throw new TransferException(trans('payment.insufficient_balance'));
            }

            return $account->transactions()->create([
                'type'                 => 'send',
                'status'               => 'pending-transfer',
                'value'                => $value,
                'description'          => $bankAccount->transferDescription(),
                'transfer_bank'        => $bankAccount->bank_name,
                'transfer_beneficiary' => $bankAccount->beneficiary,
                'transfer_number'      => $bankAccount->number,
                'transfer_country'     => $bankAccount->country,
                'transfer_note'        => $bankAccount->note,
            ]);
        });
    }

    /**
     * Create transfer receive
     *
     * @param Money $amount
     * @param BankAccount $bankAccount
     * @return PaymentTransaction|Model
     */
    public function receiveViaTransfer(Money $amount, BankAccount $bankAccount)
    {
        $value = $this->validateAmount($amount);

        return $this->transactions()->create([
            'type'                 => 'receive',
            'status'               => 'pending-transfer',
            'value'                => $value,
            'description'          => $bankAccount->transferDescription(),
            'transfer_bank'        => $bankAccount->bank_name,
            'transfer_beneficiary' => $bankAccount->beneficiary,
            'transfer_number'      => $bankAccount->number,
            'transfer_country'     => $bankAccount->country,
            'transfer_note'        => $bankAccount->note,
        ]);
    }

    /**
     * Create Gateway receive
     *
     * @param Money $amount
     * @param Collection $gatewayData
     * @return PaymentTransaction|Model
     */
    public function receiveViaGateway(Money $amount, Collection $gatewayData)
    {
        $value = $this->validateAmount($amount);
        $data = $this->prepareGatewayData($gatewayData);

        return $this->transactions()->create([
            'id'           => $data->get('uuid'),
            'type'         => 'receive',
            'status'       => 'pending-gateway',
            'value'        => $value,
            'description'  => $data->get('description'),
            'gateway_ref'  => $data->get('ref'),
            'gateway_name' => $data->get('name'),
            'gateway_url'  => $data->get('url'),
        ]);
    }

    /**
     * Validate Gateway data
     *
     * @param Collection $data
     * @return Collection
     */
    protected function prepareGatewayData(Collection $data)
    {
        return tap($data, function (Collection $data) {
            $validator = Validator::make($data->all(), [
                'uuid' => 'nullable|uuid',
                'ref'  => 'required|string',
                'name' => 'required|string',
                'url'  => 'required|url',
            ]);

            $data->put('description', "{$data->get('name')}: {$data->get('ref')}");

            if ($validator->fails()) {
                throw new UnexpectedValueException("Invalid gateway data");
            }
        });
    }

    /**
     * Validate amount
     *
     * @param Money $amount
     * @return Money
     */
    protected function validateAmount(Money $amount)
    {
        return tap($amount, function (Money $amount) {
            if ($this->currency != $amount->getCurrency()->getCurrency()) {
                throw new UnexpectedValueException("Unexpected currency.");
            }
        });
    }

    /**
     * Get daily chart data
     *
     * @param int|null $month
     * @param int|null $year
     * @return array
     */
    public function getDailyChartData(int $month = null, int $year = null)
    {
        $starts = Carbon::createFromDate($year ?: now()->year, $month ?: now()->month, 1);
        $ends = $starts->clone()->endOfMonth();

        $receiveAggregate = $this->totalReceivedQuery()
            ->selectRaw('sum(value) as total')
            ->selectRaw('day(created_at) as day')
            ->whereDate('created_at', '>=', $starts)
            ->whereDate('created_at', '<=', $ends)
            ->groupBy('day')->get()
            ->pluck('total', 'day');

        $sendAggregate = $this->totalSentQuery()
            ->selectRaw('day(created_at) as day')
            ->selectRaw('sum(value) as total')
            ->whereDate('created_at', '>=', $starts)
            ->whereDate('created_at', '<=', $ends)
            ->groupBy('day')->get()
            ->pluck('total', 'day');

        return tap(new Collection(), function ($collection) use ($starts, $receiveAggregate, $sendAggregate) {
            for ($day = 1; $day <= $starts->daysInMonth; $day++) {
                $totalSent = $this->castMoney($sendAggregate->get($day, 0));
                $totalReceived = $this->castMoney($receiveAggregate->get($day, 0));
                $current = $starts->clone()->day($day);

                $data['date'] = $current->toDateString();
                $data['formatted_total_sent'] = $totalSent->format();
                $data['total_sent'] = $totalSent->getValue();
                $data['formatted_total_received'] = $totalReceived->format();
                $data['total_received'] = $totalReceived->getValue();
                $collection->push($data);
            }
        });
    }
}
