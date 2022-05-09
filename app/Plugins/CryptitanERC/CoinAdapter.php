<?php

namespace App\Plugins\CryptitanERC;

use App\CoinAdapters\AbstractTokenAdapter;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    const NAME = "Cryptitan (ERC-20)";
    const IDENTIFIER = "cpc-erc";
    const BASE_UNIT = "100";
    const PRECISION = 2;
    const CURRENCY_PRECISION = 6;
    const SYMBOL = "CPC";
    const SYMBOL_FIRST = true;
    const COLOR = "#603A40";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0xf7010663DE9c49C661B124C2EC85484bCC9348F2";

    /**
     * @inheritDoc
     */
    protected function init()
    {
        $this->client = Http::baseUrl('http://ethereum-api:7000/')->acceptJson();
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
        return "ethereum";
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
        return $this->coinGeckoId();
    }
}