<?php

namespace App\Console\Commands;

use App\CoinAdapters\Resources\Transaction;
use App\Models\TransferRecord;
use Illuminate\Console\Command;

class UpdateTransferRecords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transfer-records:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update transfer records confirmations';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     * @throws \Exception
     */
    public function handle()
    {
        TransferRecord::has('walletTransaction')
            ->whereColumn('confirmations', '<', 'required_confirmations')
            ->get()->each(function (TransferRecord $record) {
                rescue(function () use ($record) {
                    $coin = $record->walletAccount->wallet->coin;

                    $resource = $record->walletAccount->wallet->resource;
                    $hash = $record->walletTransaction->hash;

                    $resource = rescue(function () use ($coin, $resource, $hash) {
                        return $coin->adapter->getTransaction($resource, $hash);
                    }, null, false);

                    if ($resource instanceof Transaction) {
                        $coin->saveTransactionResource($resource);
                    }
                });
            });
    }
}
