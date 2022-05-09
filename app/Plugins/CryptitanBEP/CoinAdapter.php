<?php

namespace App\Plugins\CryptitanBEP;

use App\CoinAdapters\AbstractTokenAdapter;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    const NAME = "Cryptitan (BEP-20)";
    const IDENTIFIER = "cpc-bep";
    const BASE_UNIT = "100";
    const PRECISION = 2;
    const CURRENCY_PRECISION = 6;
    const SYMBOL = "CPC";
    const SYMBOL_FIRST = true;
    const COLOR = "#8eecf5";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0x3Dd9Bf19324DCa752791Df0622BCB5f8CB85B64A";

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
        return app_path("CoinAdapters/svgIcons/default.json");
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
        return (string) BigDecimal::of($this->getBaseUnit())->multipliedBy(1000000000000);
    }

    /**
     * @inheritDoc
     */
    protected function chainId()
    {
        return "binance-smart-chain";
    }
}