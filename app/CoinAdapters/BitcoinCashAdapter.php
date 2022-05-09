<?php

namespace App\CoinAdapters;


use Brick\Math\BigDecimal;
use GuzzleHttp\Exception\GuzzleException;
use NeoScrypts\BitGo\BitGoException;
use NeoScrypts\BitGo\Coin;

class BitcoinCashAdapter extends AbstractBitGoAdapter
{
    const NAME = "Bitcoin Cash";
    const IDENTIFIER = "bch";
    const BASE_UNIT = "100000000";
    const PRECISION = 8;
    const CURRENCY_PRECISION = 2;
    const SYMBOL = "BCH";
    const SYMBOL_FIRST = true;
    const COLOR = "#80BD3B";

    /**
     * Get Bitgo Identifier
     *
     * @return string
     */
    public function getBitgoIdentifier(): string
    {
        return Coin::BITCOIN_CASH;
    }

    /**
     * Get Bitgo Identifier
     *
     * @return string
     */
    public function getBitgoTestIdentifier(): string
    {
        return Coin::TEST_BITCOIN_CASH;
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
        return "bitcoin-cash";
    }
}
