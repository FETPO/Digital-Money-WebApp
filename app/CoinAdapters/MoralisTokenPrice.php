<?php

namespace App\CoinAdapters;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class MoralisTokenPrice
{
    /**
     * {@inheritdoc}
     * @throws RequestException
     */
    public function getDollarPrice(): float
    {
        return Http::acceptJson()
            ->withHeaders([
                "X-API-Key" => $this->config('moralis_key')
            ])
            ->get("https://deep-index.moralis.io/api/v2/erc20/{$this->getContract()}/price", array_filter([
                "chain"    => "bsc",
                "exchange" => $this->config('moralis_dex')
            ]))
            ->throw()->json('usdPrice');
    }
}