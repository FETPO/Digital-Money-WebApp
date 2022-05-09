<?php

namespace App\Plugins\BDollarBEP;

use App\CoinAdapters\AbstractTokenAdapter;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    const NAME = "Binance USD (BEP-20)";
    const IDENTIFIER = "busd-bep";
    const BASE_UNIT = "1000000000000000000";
    const PRECISION = 8;
    const CURRENCY_PRECISION = 4;
    const SYMBOL = "BUSD";
    const SYMBOL_FIRST = true;
    const COLOR = "#ecb919";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

    /**
     * @inheritDoc
     */
    protected function init()
    {
        $this->client = Http::baseUrl('http://binance-api:7000/')->acceptJson();
    }

    /**
     * @inheritDoc
     */
    protected function getSvgIconPath()
    {
        return __DIR__ . "/resources/icon.json";
    }

    /**
     * @inheritDoc
     */
    public function coinGeckoId(): string
    {
        return "binancecoin";
    }

    /**
     * @inheritDoc
     */
    public function getMinimumTransferable()
    {
        return (string) BigDecimal::of($this->getBaseUnit());
    }

    /**
     * @inheritDoc
     */
    public function getMaximumTransferable()
    {
        return (string) BigDecimal::of($this->getBaseUnit())->multipliedBy(1000000);
    }

    /**
     * @inheritDoc
     */
    protected function chainId()
    {
        return "binance-smart-chain";
    }
}