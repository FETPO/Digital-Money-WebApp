<?php

namespace App\Plugins\TetherERC;

use App\CoinAdapters\AbstractTokenAdapter;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    const NAME = "Tether USD (ERC-20)";
    const IDENTIFIER = "usdt-erc";
    const BASE_UNIT = "1000000";
    const PRECISION = 6;
    const CURRENCY_PRECISION = 4;
    const SYMBOL = "USDT";
    const SYMBOL_FIRST = true;
    const COLOR = "#4fb095";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0xdac17f958d2ee523a2206206994597c13d831ec7";

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