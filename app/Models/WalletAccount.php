<?php

namespace App\Models;

use App\CoinAdapters\Resources\PendingApproval;
use App\CoinAdapters\Resources\Transaction;
use App\Events\WalletAccountSaved;
use App\Exceptions\TransferException;
use App\Helpers\CoinFormatter;
use App\Models\Traits\Lock;
use Brick\Math\BigDecimal;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use UnexpectedValueException;

class WalletAccount extends Model
{
    use HasFactory, Lock;

    protected $priceObject;
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
    protected $totalSentAttribute;
    protected $totalSentObject;
    protected $totalUnspentByAddress;

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['wallet', 'user'];

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        'saved' => WalletAccountSaved::class,
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'min_transferable',
        'min_transferable_price',
        'formatted_min_transferable_price',
        'max_transferable',
        'max_transferable_price',
        'formatted_max_transferable_price',
        'balance_on_trade',
        'balance_on_trade_price',
        'formatted_balance_on_trade_price',
        'balance',
        'balance_price',
        'formatted_balance_price',
        'available',
        'available_price',
        'formatted_available_price',
        'total_received',
        'total_received_price',
        'formatted_total_received_price',
        'total_sent',
        'total_sent_price',
        'formatted_total_sent_price',
        'coin',
        'price',
        'formatted_price',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getMinTransferableObject()
    {
        if (!isset($this->minTransferableObject)) {
            $minTransferable = $this->wallet->coin->adapter->getMinimumTransferable();
            $this->minTransferableObject = coin($minTransferable, $this->wallet->coin);
        }
        return $this->minTransferableObject;
    }

    /**
     * @return float
     */
    public function getMinTransferableAttribute()
    {
        return $this->getMinTransferableObject()->getValue();
    }

    /**
     * @return string
     */
    public function getMinTransferablePriceAttribute()
    {
        return $this->getMinTransferableObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedMinTransferablePriceAttribute()
    {
        return $this->getMinTransferableObject()->getFormattedPrice($this->user->currency);
    }

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getMaxTransferableObject()
    {
        if (!isset($this->maxTransferableObject)) {
            $maxTransferable = $this->wallet->coin->adapter->getMaximumTransferable();
            $this->maxTransferableObject = coin($maxTransferable, $this->wallet->coin);
        }
        return $this->maxTransferableObject;
    }

    /**
     * @return float
     */
    public function getMaxTransferableAttribute()
    {
        return $this->getMaxTransferableObject()->getValue();
    }

    /**
     * @return string
     */
    public function getMaxTransferablePriceAttribute()
    {
        return $this->getMaxTransferableObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedMaxTransferablePriceAttribute()
    {
        return $this->getMaxTransferableObject()->getFormattedPrice($this->user->currency);
    }

    /**
     * Calculate Available Balance
     *
     * @return mixed
     */
    public function getAvailable()
    {
        if (!isset($this->availableAttribute)) {
            $this->availableAttribute = (string) BigDecimal::of($this->getBalance())->minus($this->getBalanceOnTrade());
        }
        return $this->availableAttribute;
    }

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getAvailableObject()
    {
        if (!isset($this->availableObject)) {
            $this->availableObject = coin($this->getAvailable(), $this->wallet->coin);
        }
        return $this->availableObject;
    }

    /**
     * @return float
     */
    public function getAvailableAttribute()
    {
        return $this->getAvailableObject()->getValue();
    }

    /**
     * @return string
     */
    public function getAvailablePriceAttribute()
    {
        return $this->getAvailableObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedAvailablePriceAttribute()
    {
        return $this->getAvailableObject()->getFormattedPrice($this->user->currency);
    }


    /**
     * Calculate Balance on a pending trade
     *
     * @return mixed
     */
    public function getBalanceOnTrade()
    {
        if (!isset($this->balanceOnTradeAttribute)) {
            $exchangeTrade = $this->exchangeTrades()
                ->where('type', 'sell')->where('status', 'pending')
                ->sum('wallet_value');

            $this->balanceOnTradeAttribute = $exchangeTrade;
        }
        return $this->balanceOnTradeAttribute;
    }

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getBalanceOnTradeObject()
    {
        if (!isset($this->balanceOnTradeObject)) {
            $this->balanceOnTradeObject = coin($this->getBalanceOnTrade(), $this->wallet->coin);
        }
        return $this->balanceOnTradeObject;
    }

    /**
     * @return float
     */
    public function getBalanceOnTradeAttribute()
    {
        return $this->getBalanceOnTradeObject()->getValue();
    }

    /**
     * @return string
     */
    public function getBalanceOnTradePriceAttribute()
    {
        return $this->getBalanceOnTradeObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedBalanceOnTradePriceAttribute()
    {
        return $this->getBalanceOnTradeObject()->getFormattedPrice($this->user->currency);
    }

    /**
     * Calculate Balance
     *
     * @return mixed
     */
    public function getBalance()
    {
        if (!isset($this->balanceAttribute)) {
            $this->balanceAttribute = (string) BigDecimal::of($this->getTotalReceived())->minus($this->getTotalSent());
        }
        return $this->balanceAttribute;
    }

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getBalanceObject()
    {
        if (!isset($this->balanceObject)) {
            $this->balanceObject = coin($this->getBalance(), $this->wallet->coin);
        }
        return $this->balanceObject;
    }

    /**
     * @return float
     */
    public function getBalanceAttribute()
    {
        return $this->getBalanceObject()->getValue();
    }

    /**
     * @return string
     */
    public function getBalancePriceAttribute()
    {
        return $this->getBalanceObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedBalancePriceAttribute()
    {
        return $this->getBalanceObject()->getFormattedPrice($this->user->currency);
    }

    /**
     * Sum total received
     *
     * @return mixed
     */
    public function getTotalReceived()
    {
        if (!isset($this->totalReceivedAttribute)) {
            $this->totalReceivedAttribute = $this->transferRecords()
                ->whereColumn('confirmations', '>=', 'required_confirmations')
                ->where('type', 'receive')->sum('value');
        }
        return $this->totalReceivedAttribute;
    }

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getTotalReceivedObject()
    {
        if (!isset($this->totalReceivedObject)) {
            $this->totalReceivedObject = coin($this->getTotalReceived(), $this->wallet->coin);
        }
        return $this->totalReceivedObject;
    }

    /**
     * @return float
     */
    public function getTotalReceivedAttribute()
    {
        return $this->getTotalReceivedObject()->getValue();
    }

    /**
     * @return string
     */
    public function getTotalReceivedPriceAttribute()
    {
        return $this->getTotalReceivedObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedTotalReceivedPriceAttribute()
    {
        return $this->getTotalReceivedObject()->getFormattedPrice($this->user->currency);
    }

    /**
     * Sum total sent
     *
     * @return mixed
     */
    public function getTotalSent()
    {
        if (!isset($this->totalSentAttribute)) {
            $this->totalSentAttribute = $this->transferRecords()
                ->where('type', 'send')->sum('value');
        }
        return $this->totalSentAttribute;
    }

    /**
     * @return \App\Helpers\CoinFormatter|mixed
     */
    public function getTotalSentObject()
    {
        if (!isset($this->totalSentObject)) {
            $this->totalSentObject = coin($this->getTotalSent(), $this->wallet->coin);
        }
        return $this->totalSentObject;
    }

    /**
     * @return float
     */
    public function getTotalSentAttribute()
    {
        return $this->getTotalSentObject()->getValue();
    }

    /**
     * @return string
     */
    public function getTotalSentPriceAttribute()
    {
        return $this->getTotalSentObject()->getPrice($this->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedTotalSentPriceAttribute()
    {
        return $this->getTotalSentObject()->getFormattedPrice($this->user->currency);
    }

    /**
     * Related Exchange Trades
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exchangeTrades()
    {
        return $this->hasMany(ExchangeTrade::class, 'wallet_account_id', 'id');
    }

    /**
     * Calculate transaction fee
     *
     * @param CoinFormatter $amount
     * @param int $outputs
     * @return CoinFormatter
     */
    public function getTransactionFee(CoinFormatter $amount, int $outputs = 1)
    {
        return $this->wallet->estimateTransactionFee(
            $this->totalUnspentByAddress() ?: 1,
            $outputs,
            $amount->getAmount()
        );
    }

    /**
     * Get withdrawal fee
     *
     * @param CoinFormatter $amount
     * @return CoinFormatter
     */
    public function getWithdrawalFee(CoinFormatter $amount)
    {
        return $this->wallet->getWithdrawalFee($amount);
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
        return $this->wallet->getExchangeFee($amount, $category);
    }

    /**
     * Get total unspents by address
     *
     * @return int
     */
    public function totalUnspentByAddress()
    {
        if (!isset($this->totalUnspentByAddress)) {
            $query = $this->transferRecords()
                ->whereNotNull('wallet_transaction_id')
                ->where('type', 'receive');

            $lastSentQuery = $this->transferRecords()
                ->whereNotNull('wallet_transaction_id')
                ->where('type', 'send')->latest();

            if ($lastSent = $lastSentQuery->first()) {
                $query = $query->where('created_at', '>=', $lastSent->created_at);
            }

            $this->totalUnspentByAddress = $query->count();
        }
        return $this->totalUnspentByAddress;
    }

    /**
     * Get coin price
     *
     * @return mixed
     */
    public function getPriceAttribute()
    {
        return $this->wallet->coin->getValueObject()
            ->getPrice($this->user->currency);
    }

    /**
     * Get formatted coin price
     *
     * @return mixed
     */
    public function getFormattedPriceAttribute()
    {
        return $this->wallet->coin->getValueObject()
            ->getFormattedPrice($this->user->currency);
    }

    /**
     * Get coin name
     *
     * @return mixed|string
     */
    public function getCoinAttribute()
    {
        return $this->wallet->coin->name;
    }

    /**
     * Validate amount
     *
     * @param CoinFormatter $amount
     * @return CoinFormatter
     * @throws Exception
     */
    protected function validateAmount(CoinFormatter $amount)
    {
        return tap($amount, function (CoinFormatter $amount) {
            if ($amount->getCoin()->isNot($this->wallet->coin)) {
                throw new Exception("Unexpected coin.");
            }
        });
    }

    /**
     * Credit wallet account
     *
     * @param CoinFormatter $amount
     * @param string $description
     * @param float|null $dollarPrice
     */
    public function credit(CoinFormatter $amount, string $description, float $dollarPrice = null)
    {
        $value = $this->validateAmount($amount);

        $this->transferRecords()->create([
            'type'         => 'receive',
            'dollar_price' => $dollarPrice ?: $value->getDollarPrice(),
            'description'  => $description,
            'value'        => $value->getAmount(),
        ]);
    }

    /**
     * Debit wallet account
     *
     * @param CoinFormatter $amount
     * @param string $description
     * @param float|null $dollarPrice
     */
    public function debit(CoinFormatter $amount, string $description, float $dollarPrice = null)
    {
        $value = $this->validateAmount($amount);

        $this->transferRecords()->create([
            'type'         => 'send',
            'dollar_price' => $dollarPrice ?: $value->getDollarPrice(),
            'description'  => $description,
            'value'        => $value->getAmount(),
        ]);
    }

    /**
     * Parse amount as CoinFormatter object
     *
     * @param $amount
     * @return CoinFormatter|void
     * @throws Exception
     */
    public function parseAmount($amount)
    {
        if (is_numeric($amount)) {
            return coin($amount, $this->wallet->coin, true);
        }

        if ($amount instanceof CoinFormatter) {
            return $amount;
        }

        throw new TransferException("Invalid amount.");
    }

    /**
     * Parse target as either a user a wallet account or external address
     *
     * @param User|WalletAccount|string $target
     * @return WalletAccount|string
     * @throws TransferException
     */
    public function parseTarget($target)
    {
        if ($target instanceof WalletAccount) {
            if ($target->is($this)) {
                throw new TransferException(trans('wallet.cannot_send_to_same_account'));
            } else if ($target->wallet->isNot($this->wallet)) {
                throw new TransferException(trans('wallet.different_account_parent_wallet'));
            }

            return $target;
        } else if (is_string($target)) {
            if (filter_var($target, FILTER_VALIDATE_EMAIL)) {
                if (!$user = User::where('email', $target)->first()) {
                    throw new TransferException(trans('auth.user_email_not_found', ['email' => $target]));
                } else if ($user->is($this->user)) {
                    throw new TransferException(trans('wallet.cannot_send_to_same_user'));
                }

                return $this->wallet->getAccount($user);
            } else {
                $query = $this->wallet->addresses()->where('address', $target);

                if (!$walletAddress = $query->first()) {
                    return $target;
                }

                $account = $walletAddress->walletAccount;

                if ($account->is($this)) {
                    throw new TransferException(trans('wallet.cannot_send_to_same_account'));
                } else if ($account->wallet->isNot($this->wallet)) {
                    throw new TransferException(trans('wallet.different_account_parent_wallet'));
                }

                return $account;
            }
        } else if ($target instanceof User) {
            if ($target->is($this->user)) {
                throw new TransferException(trans('wallet.cannot_send_to_same_user'));
            }

            return $this->wallet->getAccount($target);
        }
    }

    /**
     * Handle internal and external transfer
     *
     * @param CoinFormatter|int|float $amount
     * @param User|WalletAccount|string $target
     * @return TransferRecord
     */
    public function send($amount, $target)
    {
        return $this->acquireLock(function () use ($amount, $target) {
            $account = $this->fresh();
            $target = $account->parseTarget($target);
            $amount = $account->parseAmount($amount);

            $coin = $account->wallet->coin;

            if ($amount->isNegativeOrZero()) {
                throw new TransferException(trans('wallet.invalid_amount'));
            }

            if ($target instanceof WalletAccount) {
                return DB::transaction(function () use ($account, $coin, $target, $amount) {
                    if ($account->getAvailableObject()->lessThan($amount)) {
                        throw new TransferException(trans('wallet.insufficient_available'));
                    }

                    $target->transferRecords()->create([
                        'type'         => 'receive',
                        'dollar_price' => $coin->getDollarPrice(),
                        'description'  => "From: {$account->user->name}",
                        'value'        => $amount->getAmount(),
                    ]);

                    return $account->transferRecords()->create([
                        'type'         => 'send',
                        'dollar_price' => $coin->getDollarPrice(),
                        'description'  => "To: {$target->user->name}",
                        'value'        => $amount->getAmount(),
                    ]);
                });
            } else if (is_string($target)) {
                $operator = $account->wallet->operatorAccount();
                $transactionFee = $account->getTransactionFee($amount);
                $withdrawalFee = $account->getWithdrawalFee($amount);

                if ($account->isNot($operator)) {
                    $deductible = $amount->add($transactionFee)->add($withdrawalFee);
                } else {
                    $deductible = $amount->add($transactionFee);
                }

                if ($account->getAvailableObject()->lessThan($deductible)) {
                    throw new TransferException(trans('wallet.insufficient_available'));
                }

                $record = $account->transferRecords()->create([
                    'type'                   => 'send',
                    'dollar_price'           => $coin->getDollarPrice(),
                    'value'                  => $deductible->getAmount(),
                    'description'            => "To: {$target}",
                    'required_confirmations' => 1,
                    'external'               => true
                ]);

                return tap($record, function (TransferRecord $record) use ($account, $target, $amount, $operator, $withdrawalFee, $coin) {
                    $resource = $account->wallet->send($target, $amount->getAmount());

                    if ($resource instanceof Transaction) {
                        $transaction = $account->wallet->transactions()->create([
                            'hash'          => $resource->getHash(),
                            'type'          => $resource->getType(),
                            'value'         => $resource->getValue(),
                            'confirmations' => $resource->getConfirmations(),
                            'date'          => $resource->getDate(),
                            'resource'      => $resource,
                        ]);

                        $record->walletTransaction()->associate($transaction)->save();
                    } else if ($resource instanceof PendingApproval) {
                        $record->pendingApproval()->create([
                            'ref'      => $resource->getId(),
                            'state'    => $resource->getState(),
                            'hash'     => $resource->getHash(),
                            'resource' => $resource,
                        ]);
                    } else {
                        throw new UnexpectedValueException("Unknown return value");
                    }

                    if (optional($operator)->isNot($account) && $withdrawalFee->isPositive()) {
                        $description = "Withdrawal Fee: {$account->user->name}";

                        $operator->transferRecords()->create([
                            'type'         => 'receive',
                            'value'        => $withdrawalFee->getAmount(),
                            'dollar_price' => $coin->getDollarPrice(),
                            'description'  => $description,
                        ]);

                        Earning::wallet($withdrawalFee, $description, $operator->user);
                    }
                });
            }

            throw new TransferException(trans('wallet.invalid_target_account'));
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|Wallet
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|WalletAddress
     */
    public function walletAddresses()
    {
        return $this->hasMany(WalletAddress::class, 'wallet_account_id', 'id')->latest();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|TransferRecord
     */
    public function transferRecords()
    {
        return $this->hasMany(TransferRecord::class, 'wallet_account_id', 'id');
    }

    /**
     * @param $address
     * @return bool
     */
    public function hasWalletAddress($address)
    {
        return $this->walletAddresses()->where('address', $address)->exists();
    }
}
