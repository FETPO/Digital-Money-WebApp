<?php

namespace App\Plugins\ShibaInuERC;

use App\CoinAdapters\AbstractTokenAdapter;
use App\CoinAdapters\SvgIconUrl;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    use SvgIconUrl;

    const NAME = "Shiba Inu (ERC-20)";
    const IDENTIFIER = "shib-erc";
    const BASE_UNIT = "1000000000000000000";
    const PRECISION = 8;
    const CURRENCY_PRECISION = 8;
    const SYMBOL = "SHIB";
    const SYMBOL_FIRST = true;
    const COLOR = "#d67235";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce";

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
        return "coin/shib.svg";
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
        return (string) BigDecimal::of($this->getBaseUnit())->multipliedBy(100000000000000);
    }

    /**
     * @inheritDoc
     */
    protected function chainId()
    {
        return $this->coinGeckoId();
    }
}