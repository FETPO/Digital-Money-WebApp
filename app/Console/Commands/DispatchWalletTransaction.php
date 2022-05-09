<?php

namespace App\Console\Commands;

use App\CoinAdapters\Resources\Transaction;
use App\Jobs\ProcessWalletTransaction;
use App\Models\Coin;
use Illuminate\Console\Command;

class DispatchWalletTransaction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dispatch:wallet-transaction';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch wallet transaction job for processing.';

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
     * @return int
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function handle()
    {
        Coin::all()->each(function (Coin $coin) {
            collect($coin->getTransactionResourcePaths())
                ->each(function ($path) use ($coin) {
                    $resource = $coin->getTransactionResource($path);

                    if ($resource instanceof Transaction) {
                        ProcessWalletTransaction::dispatch($resource, $coin);
                        $this->info("Dispatched: " . $resource->getId());
                    }
                });
        });
    }
}
