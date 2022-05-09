<?php

namespace App\CoinAdapters\Contracts;

use App\CoinAdapters\Resources\Wallet;

interface Consolidates
{
    /**
     * Consolidate funds from the address
     *
     * @param Wallet $wallet
     * @param string $address
     * @param $passphrase
     * @return string
     */
    public function consolidate(Wallet $wallet, string $address, $passphrase): string;
}