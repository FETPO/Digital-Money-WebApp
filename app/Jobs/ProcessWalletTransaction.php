<?php

namespace App\Jobs;

use App\CoinAdapters\Contracts\Consolidates;
use App\CoinAdapters\Resources\Transaction;
use App\Exceptions\TransferException;
use App\Models\Coin;
use App\Models\TransferRecord;
use App\Models\WalletAddress;
use App\Models\WalletTransaction;
use Brick\Math\BigDecimal;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProcessWalletTransaction implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var Transaction
     */
    protected $resource;

    /**
     * @var Coin
     */
    protected $coin;

    /**
     * @var WalletTransaction
     */
    protected $incomingTransaction;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 1;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 120;

    /**
     * Create a new job instance.
     *
     * @param Transaction $resource
     * @param Coin $coin
     */
    public function __construct(Transaction $resource, Coin $coin)
    {
        $this->resource = $resource;
        $this->coin = $coin;
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws Exception
     * @throws \Throwable
     */
    public function handle()
    {
        DB::transaction(function () {
            switch ($this->resource->getType()) {
                case "receive":
                    $this->handleIncomingTransaction();
                case "send":
                    $this->handleOutgoingTransaction();
            }
            $this->removeResource();
        });
    }

    /**
     * Handle outgoing transaction
     *
     * @return void
     * @throws Exception
     */
    protected function handleOutgoingTransaction()
    {
        $query = $this->coin->wallet
            ->transactions()->where('hash', $this->resource->getHash())
            ->where('type', $this->resource->getType());

        if ($transaction = $query->first()) {
            $transaction->transferRecords->each(function (TransferRecord $record) {
                $record->update(['confirmations' => $this->resource->getConfirmations()]);
            });

            $transaction->update([
                'confirmations' => $this->resource->getConfirmations(),
                'resource'      => $this->resource,
            ]);
        }
    }

    /**
     * Handle Incoming transaction
     *
     * @throws Exception
     * @throws \Throwable
     */
    protected function handleIncomingTransaction()
    {
        $output = $this->resource->getOutput();

        if (is_array($output)) {
            collect($output)->each(function ($output) {
                $query = $this->coin->wallet->addresses()->where('address', $output['address']);

                if ($address = $query->first()) {
                    $this->saveTransferRecord($address, $output['value']);
                }
            });
        }

        if (is_string($output)) {
            $query = $this->coin->wallet->addresses()->where('address', $output);

            if ($address = $query->first()) {
                $this->saveTransferRecord($address);
            }
        }
    }

    /**
     * Save transfer record
     *
     * @param WalletAddress $address
     * @param string $value
     * @return void
     * @throws Exception
     * @throws \Throwable
     */
    protected function saveTransferRecord(WalletAddress $address, $value = null)
    {
        $transferRecord = $address->walletAccount->acquireLock(function () use ($address, $value) {
            $transaction = $this->getIncomingTransaction();

            return $address->transferRecords()->updateOrCreate([
                'wallet_account_id'     => $address->wallet_account_id,
                'wallet_transaction_id' => $transaction->id,
            ], [
                'dollar_price'           => $this->coin->getDollarPrice(),
                'value'                  => $this->abs($value ?: $transaction->value),
                'description'            => "From: {$address->address}",
                'type'                   => $transaction->type,
                'confirmations'          => $transaction->confirmations,
                'required_confirmations' => $this->coin->wallet->min_conf,
                'external'               => true,
            ]);
        });

        if (!$transferRecord instanceof TransferRecord) {
            throw new TransferException(trans('wallet.account_in_use'));
        }

        if ($transferRecord->wasRecentlyCreated && $transferRecord->walletAddress) {
            rescue(function () use ($transferRecord) {
                $this->consolidate($transferRecord);
            });
        }
    }

    /**
     * Consolidate transfer record's wallet
     *
     * @param TransferRecord $record
     */
    protected function consolidate(TransferRecord $record)
    {
        $wallet = $record->walletAccount->wallet;

        if ($wallet->consolidates) {
            $wallet->coin->adapter->consolidate(
                $wallet->resource,
                $record->walletAddress->address,
                $wallet->passphrase
            );
        }
    }

    /**
     * Save wallet transaction
     *
     * @return WalletTransaction
     * @throws Exception
     */
    protected function getIncomingTransaction()
    {
        if (!isset($this->incomingTransaction)) {
            $this->incomingTransaction = $this->coin->wallet->transactions()
                ->updateOrCreate([
                    'hash' => $this->resource->getHash(),
                    'type' => $this->resource->getType(),
                ], [
                    'date'          => $this->resource->getDate(),
                    'confirmations' => $this->resource->getConfirmations(),
                    'value'         => $this->resource->getValue(),
                    'resource'      => $this->resource,
                ]);
        }
        return $this->incomingTransaction;
    }

    /**
     * Get absolute value
     *
     * @param $value
     * @return string
     */
    protected function abs($value)
    {
        return (string) BigDecimal::of($value)->abs();
    }

    /**
     * Remove the resource then release lock
     *
     * @return void
     */
    protected function removeResource()
    {
        $this->coin->removeTransactionResource($this->resource);
    }

    /**
     * The unique ID of the job.
     *
     * @return string
     */
    public function uniqueId()
    {
        return $this->resource->lockKey();
    }

    /**
     * Get the cache driver for the unique job lock.
     *
     * @return \Illuminate\Contracts\Cache\Repository
     */
    public function uniqueVia()
    {
        return Cache::driver('redis');
    }
}
