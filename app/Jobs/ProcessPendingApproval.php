<?php

namespace App\Jobs;

use App\Models\Coin;
use App\Models\PendingApproval;
use App\CoinAdapters\Resources\PendingApproval as PendingApprovalResource;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class ProcessPendingApproval implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var PendingApprovalResource
     */
    protected $resource;

    /**
     * @var Coin
     */
    protected $coin;

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
     * @param Coin $coin
     * @param PendingApprovalResource $resource
     */
    public function __construct(PendingApprovalResource $resource, Coin $coin)
    {
        $this->resource = $resource;
        $this->coin = $coin;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->handlePendingApproval();
        $this->cleanUp();
    }

    /**
     * Handle pending withdrawal
     *
     * @return void
     */
    protected function handlePendingApproval()
    {
        $pendingApproval = PendingApproval::has('transferRecord')
            ->where('ref', $this->resource->getId())->first();

        if ($pendingApproval && $this->resource->approved()) {
            $pendingApproval->update([
                'state'    => $this->resource->getState(),
                'hash'     => $this->resource->getHash(),
                'resource' => $this->resource,
            ]);

            $transactionResource = $this->coin->adapter->getTransaction(
                $this->coin->wallet->resource, $this->resource->getHash()
            );

            $transaction = $this->coin->wallet->transactions()->updateOrCreate([
                'hash' => $transactionResource->getHash(),
            ], [
                'type'          => $transactionResource->getType(),
                'value'         => $transactionResource->getValue(),
                'date'          => $transactionResource->getDate(),
                'confirmations' => $transactionResource->getConfirmations(),
                'resource'      => $transactionResource,
            ]);

            $pendingApproval->transferRecord->update([
                'confirmations'         => $transaction->confirmations,
                'wallet_transaction_id' => $transaction->id,
            ]);
        }
    }

    /**
     * Remove the resource then release lock
     *
     * @return void
     */
    protected function cleanUp()
    {
        $this->coin->removePendingApprovalResource($this->resource);
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
