<?php

namespace App\Plugins\ChainERC;

use App\CoinAdapters\AbstractTokenAdapter;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    const NAME = "ChainLink (ERC-20)";
    const IDENTIFIER = "link-erc";
    const BASE_UNIT = "1000000000000000000";
    const PRECISION = 8;
    const CURRENCY_PRECISION = 2;
    const SYMBOL = "LINK";
    const SYMBOL_FIRST = true;
    const COLOR = "#325ed3";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0x514910771af9ca656af840dff83e8264ecf986ca";

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
        return __DIR__ . "/resources/icon.json";
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
        return (string) BigDecimal::of($this->getBaseUnit())->multipliedBy(1000000);
    }

    /**
     * @inheritDoc
     */
    protected function chainId()
    {
        return $this->coinGeckoId();
    }
}