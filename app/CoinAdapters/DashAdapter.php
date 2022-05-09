<?php

namespace App\CoinAdapters;


use Brick\Math\BigDecimal;
use GuzzleHttp\Exception\GuzzleException;
use NeoScrypts\BitGo\BitGoException;
use NeoScrypts\BitGo\Coin;

class DashAdapter extends AbstractBitGoAdapter
{
    const NAME = "Dash";
    const IDENTIFIER = "dash";
    const BASE_UNIT = "100000000";
    const PRECISION = 8;
    const CURRENCY_PRECISION = 2;
    const SYMBOL = "DASH";
    const SYMBOL_FIRST = true;
    const COLOR = '#008DE4';

    /**
     * Get Bitgo Identifier
     *
     * @return string
     */
    public function getBitgoIdentifier(): string
    {
        return Coin::DASH;
    }

    /**
     * Get Bitgo Identifier
     *
     * @return string
     */
    public function getBitgoTestIdentifier(): string
    {
        return Coin::TEST_DASH;
    }

    /**
     * Estimate transaction fee in base unit
     *
     * {@inheritdoc}
     * @throws BitGoException
     * @throws GuzzleException
     */
    public function estimateTransactionFee(int $inputs, int $outputs, $amount = 0, int $minConf = null)
    {
        $bitgoPercent = config('services.bitgo.fee_percent', 0.01);
        $bitgoFee = BigDecimal::of($amount)->multipliedBy($bitgoPercent);

        $multiplier = (($inputs * 360) + (($outputs + 1) * 34) + 10 + $inputs);

        return (string) BigDecimal::of($this->getFeeEstimate($minConf))
            ->multipliedBy($multiplier)->plus($bitgoFee);
    }

    /**
     * {@inheritdoc}
     */
    public function getMinimumTransferable()
    {
        return (string) BigDecimal::of(3000);
    }

    /**
     * {@inheritdoc}
     */
    public function getMaximumTransferable()
    {
        return (string) BigDecimal::of($this->getBaseUnit())->multipliedBy(1000);
    }

    /**
     * @inheritDoc
     */
    public function coinGeckoId(): string
    {
        return "dash";
    }
}
