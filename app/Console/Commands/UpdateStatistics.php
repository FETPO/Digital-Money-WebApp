<?php

namespace App\Console\Commands;

use App\Models\PaymentAccount;
use App\Models\SupportedCurrency;
use App\Models\Wallet;
use Illuminate\Console\Command;

class UpdateStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'statistics:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update system statistics';

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
     * @return int|void
     */
    public function handle()
    {
        $this->updateSupportedCurrencyStatistics();
        $this->updateWalletStatistics();
    }

    /**
     * Update Supported Currency statistics
     *
     * @return void
     */
    protected function updateSupportedCurrencyStatistics()
    {
        SupportedCurrency::all()->each(function (SupportedCurrency $currency) {
            $paymentAccounts = $currency->paymentAccounts()->get();

            $currency->statistic()->firstOrNew()->fill([
                'balance_on_trade' => $paymentAccounts->sum('balance_on_trade'),
                'balance'          => $paymentAccounts->sum('balance'),
            ])->save();
        });
    }

    /**
     * Update wallet statistics
     *
     * @return void
     */
    protected function updateWalletStatistics()
    {
        Wallet::all()->each(function (Wallet $wallet) {
            $walletAccounts = $wallet->accounts()->get();

            $wallet->statistic()->firstOrNew()->fill([
                'balance_on_trade' => $walletAccounts->sum('balance_on_trade'),
                'balance'          => $walletAccounts->sum('balance'),
            ])->save();
        });
    }
}
