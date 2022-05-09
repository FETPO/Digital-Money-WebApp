<?php
/**
 * ======================================================================================================
 * File Name: CoinManager.php
 * ======================================================================================================
 * Author: HolluwaTosin360
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 1/28/2021 (6:55 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2021. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\Helpers;


use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use App\CoinAdapters\Contracts\Adapter;
use App\Models\Coin;
use App\Models\Wallet;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Str;

class CoinManager
{
    /**
     * @var Coin
     */
    protected Coin $coin;

    /**
     * @var int
     */
    protected int $minConf;

    /**
     * CoinManager constructor.
     *
     * @param Coin $coin
     * @param int $minConf
     */
    public function __construct(Coin $coin, int $minConf = 3)
    {
        $this->coin = $coin;
        $this->minConf = $minConf;
    }

    /**
     * Create wallet
     *
     * @param Adapter $adapter
     * @param int $minConf
     * @return CoinManager
     */
    public static function use(Adapter $adapter, int $minConf = 3)
    {
        $coin = Coin::firstOrCreate([
            'identifier' => $adapter->getIdentifier(),
        ], [
            'name'         => $adapter->getName(),
            'base_unit'    => $adapter->getBaseUnit(),
            'precision'    => $adapter->getPrecision(),
            'symbol'       => $adapter->getSymbol(),
            'symbol_first' => $adapter->showSymbolFirst(),
            'color'        => $adapter->getColor(),
            'adapter'      => $adapter,
        ]);

        return new static($coin, $minConf);
    }

    /**
     * Create wallet
     *
     * @return Wallet
     */
    public function createWallet()
    {
        return $this->coin->wallet()->firstOr(function () {
            $adapter = $this->coin->adapter;
            $passphrase = $this->generatePassphrase();
            $label = $this->walletLabel();

            $resource = $adapter->createWallet($label, $passphrase);
            $adapter->setTransactionWebhook($resource, $this->minConf);

            return $this->coin->wallet()->create([
                'label'      => $label,
                'passphrase' => $passphrase,
                'min_conf'   => $this->minConf,
                'resource'   => $resource,
            ]);
        });
    }

    /**
     * Get wallet  label
     *
     * @return mixed|string
     */
    protected function walletLabel()
    {
        return config('app.name');
    }

    /**
     * Generate passphrase
     *
     * @param int $length
     * @return string
     */
    protected function generatePassphrase(int $length = 100)
    {
        return Str::random($length);
    }

    /**
     * Initialize Http client
     *
     * @return PendingRequest
     */
    protected static function client()
    {
        return Http::baseUrl('https://api.coingecko.com/api/v3/')->acceptJson();
    }
}
