<?php

namespace App\CoinAdapters;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

trait CoinPrice
{
    /**
     * Initialize Http client
     *
     * @return PendingRequest
     */
    protected function coinGeckoClient()
    {
        return Http::baseUrl('https://api.coingecko.com/api/v3/')->acceptJson();
    }

    /**
     * {@inheritdoc}
     * @throws RequestException
     */
    public function getDollarPrice(): float
    {
        return (float) $this->coinGeckoClient()->get('simple/price', [
            'ids'           => $this->coinGeckoId(),
            'vs_currencies' => "usd",
        ])->throw()->collect($this->coinGeckoId())->get('usd');
    }

    /**
     * {@inheritdoc}
     * @throws RequestException
     */
    public function marketChart(int $days): array
    {
        return $this->coinGeckoClient()->get("coins/{$this->coinGeckoId()}/market_chart", [
            'days'        => $days,
            'vs_currency' => 'usd',
        ])->throw()->json('prices');
    }

    /**
     * {@inheritdoc}
     * @throws RequestException
     */
    public function getDollarPriceChange(): float
    {
        return (float) $this->coinGeckoClient()->get('simple/price', [
            'ids'                 => $this->coinGeckoId(),
            'include_24hr_change' => "true",
            'vs_currencies'       => "usd",
        ])->throw()->collect($this->coinGeckoId())->get('usd_24h_change');
    }
}