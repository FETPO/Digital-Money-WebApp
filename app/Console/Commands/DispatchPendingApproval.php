<?php

namespace App\Console\Commands;

use App\CoinAdapters\Resources\PendingApproval;
use App\Jobs\ProcessPendingApproval;
use App\Models\Coin;
use Illuminate\Console\Command;

class DispatchPendingApproval extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dispatch:pending-approval';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch pending approval job for processing.';

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
     */
    public function handle()
    {
        Coin::all()->each(function (Coin $coin) {
            collect($coin->getPendingApprovalResourcePaths())
                ->each(function ($path) use ($coin) {
                    $resource = $coin->getPendingApprovalResource($path);

                    if ($resource instanceof PendingApproval) {
                        ProcessPendingApproval::dispatch($resource, $coin);
                        $this->info("Dispatched: " . $resource->getId());
                    }
                });
        });
    }
}
