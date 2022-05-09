<?php

namespace App\CoinAdapters\Contracts;

use App\CoinAdapters\Resources\Wallet;

interface Properties
{
    /**
     * Get wallet properties
     *
     * @param Wallet $wallet
     * @return array
     */
    public function getProperties(Wallet $wallet): array;
}