<?php

namespace App\CoinAdapters\Contracts;

interface CoinGecko
{
    /**
     * Coin gecko identifier
     *
     * @return string
     */
    public function coinGeckoId(): string;
}