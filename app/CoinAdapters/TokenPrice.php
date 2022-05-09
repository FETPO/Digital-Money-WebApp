<?php

namespace App\CoinAdapters;

use App\CoinAdapters\Exceptions\AdapterException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

trait TokenPrice
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
        $contract = strtolower($this->getContract());

        return (float) $this->coinGeckoClient()->get("simple/token_price/{$this->chainId()}", [
            "contract_addresses" => $contract,
            "vs_currencies"      => "usd"
        ])->throw()->collect($contract)->get('usd', function () {
            return tap($this->config('dollar_price'), function ($price) {
                if (!is_numeric($price)) {
                    throw new AdapterException("Missing dollar price.");
                }
            });
        });
    }

    /**
     * {@inheritdoc}
     * @throws RequestException
     */
    public function marketChart(int $days): array
    {
        return rescue(function () use ($days) {
            return $this->coinGeckoClient()->get("coins/{$this->chainId()}/contract/{$this->getContract()}/market_chart", [
                'days'        => $days,
                'vs_currency' => 'usd',
            ])->throw()->json('prices') ?: array();
        }, array(), false);
    }

    /**
     * {@inheritdoc}
     * @throws RequestException
     */
    public function getDollarPriceChange(): float
    {
        $contract = strtolower($this->getContract());

        return (float) $this->coinGeckoClient()->get("simple/token_price/{$this->chainId()}", [
            "contract_addresses"  => $contract,
            "include_24hr_change" => "true",
            "vs_currencies"       => "usd"
        ])->throw()->collect($contract)->get('usd_24h_change', 0);
    }

    /**
     * Get network price
     *
     * @return float
     * @throws RequestException
     */
    protected function getNetworkDollarPrice(): float
    {
        return (float) $this->coinGeckoClient()->get('simple/price', [
            'ids'           => $this->coinGeckoId(),
            'vs_currencies' => "usd",
        ])->throw()->collect($this->coinGeckoId())->get('usd');
    }
}