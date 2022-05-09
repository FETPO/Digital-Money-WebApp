<?php

namespace App\Plugins\SafeMoonBEP;

use App\CoinAdapters\AbstractTokenAdapter;
use App\CoinAdapters\SvgIconUrl;
use Brick\Math\BigDecimal;
use Illuminate\Support\Facades\Http;

class CoinAdapter extends AbstractTokenAdapter
{
    use SvgIconUrl;

    const NAME = "SafeMoon (BEP-20)";
    const IDENTIFIER = "sfm-bep";
    const BASE_UNIT = "1000000000";
    const PRECISION = 9;
    const CURRENCY_PRECISION = 7;
    const SYMBOL = "SFM";
    const SYMBOL_FIRST = true;
    const COLOR = "#88b1ac";
    const NETWORK_BASE_UNIT = "1000000000000000000";

    const CONTRACT = "0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5";

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
        return "coin/safemoon.svg";
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