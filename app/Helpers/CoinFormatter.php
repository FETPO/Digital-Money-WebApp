<?php
/**
 * ======================================================================================================
 * File Name: CoinFormatter.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 7/14/2019 (3:47 AM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2019. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\Helpers;

use App\Models\Coin;
use Brick\Math\BigDecimal;
use Brick\Math\RoundingMode;
use InvalidArgumentException;
use UnexpectedValueException;

class CoinFormatter
{
    /**
     * @var Coin
     */
    protected Coin $coin;

    /**
     * @var BigDecimal
     */
    protected BigDecimal $amount;

    /**
     * @var float
     */
    protected float $value;

    /**
     * Coin constructor.
     *
     * @param $amount
     * @param Coin $coin
     * @param bool $convertToBase
     */
    public function __construct($amount, Coin $coin, bool $convertToBase = false)
    {
        $this->coin = $coin;
        $this->amount = $this->parseAmount($amount, $convertToBase);
    }

    /**
     * parseAmount.
     *
     * @param $amount
     * @param bool $convertToBase
     *
     * @return BigDecimal
     */
    protected function parseAmount($amount, bool $convertToBase = false)
    {
        return $this->convertAmount(BigDecimal::of($amount), $convertToBase)
            ->toScale(0, RoundingMode::HALF_DOWN);
    }

    /**
     * convertAmount.
     *
     * @param BigDecimal $amount
     * @param bool $convertToBase
     *
     * @return BigDecimal
     */
    protected function convertAmount(BigDecimal $amount, bool $convertToBase = false)
    {
        if (!$convertToBase) {
            return $amount;
        }

        return $amount->multipliedBy($this->coin->getBaseUnit());
    }

    /**
     * @param CoinFormatter $that
     * @return bool
     */
    public function lessThan(self $that)
    {
        $this->assertSameCoin($that);

        return $this->amount->isLessThan($that->getAmount());
    }

    /**
     * @param CoinFormatter $that
     * @return bool
     */
    public function lessThanOrEqual(self $that)
    {
        $this->assertSameCoin($that);

        return $this->amount->isLessThanOrEqualTo($that->getAmount());
    }

    /**
     * @param CoinFormatter $that
     * @return bool
     */
    public function greaterThan(self $that)
    {
        $this->assertSameCoin($that);

        return $this->amount->isGreaterThan($that->getAmount());
    }

    /**
     * @param CoinFormatter $that
     * @return bool
     */
    public function greaterThanOrEqual(self $that)
    {
        $this->assertSameCoin($that);

        return $this->amount->isGreaterThanOrEqualTo($that->getAmount());
    }

    /**
     * @return bool
     */
    public function isZero()
    {
        return $this->amount->isZero();
    }

    /**
     * @return bool
     */
    public function isNegativeOrZero()
    {
        return $this->amount->isNegativeOrZero();
    }

    /**
     * @return bool
     */
    public function isNegative()
    {
        return $this->amount->isNegative();
    }

    /**
     * @return bool
     */
    public function isPositive()
    {
        return $this->amount->isPositive();
    }

    /**
     * @param CoinFormatter $that
     * @return CoinFormatter
     */
    public function add(self $that)
    {
        $this->assertSameCoin($that);

        return new CoinFormatter($this->amount->plus($that->getAmount()), $this->coin);
    }

    /**
     * @param CoinFormatter $that
     * @return CoinFormatter
     */
    public function subtract(self $that)
    {
        $this->assertSameCoin($that);

        return new CoinFormatter($this->amount->minus($that->getAmount()), $this->coin);
    }

    /**
     * @param float $multiplier
     * @return CoinFormatter
     */
    public function multiply(float $multiplier)
    {
        return new CoinFormatter($this->amount->multipliedBy($multiplier), $this->coin);
    }

    /**
     * @param CoinFormatter $that
     */
    protected function assertSameCoin(self $that)
    {
        if ($this->coin->isNot($that->getCoin())) {
            throw new InvalidArgumentException('Different base coin');
        }
    }

    /**
     * @return Coin
     */
    public function getCoin()
    {
        return $this->coin;
    }

    /**
     * getAmount.
     *
     * @return string
     */
    public function getAmount()
    {
        return (string)$this->amount;
    }

    /**
     * getValue.
     *
     * @return float
     */
    public function getValue()
    {
        if (!isset($this->value)) {
            $this->value = $this->amount->exactlyDividedBy($this->coin->getBaseUnit())
                ->toScale($this->coin->getPrecision(), RoundingMode::HALF_DOWN)->toFloat();
        }
        return $this->value;
    }

    /**
     * Get underlying dollar price
     *
     * @return float
     */
    public function getDollarPrice()
    {
        return $this->coin->getDollarPrice();
    }

    /**
     * @param float|null $dollarPrice
     * @return float
     */
    protected function calcPrice(float $dollarPrice = null)
    {
        if (is_null($dollarPrice)) {
            $dollarPrice = $this->coin->getDollarPrice();
        }
        return $this->getValue() * $dollarPrice;
    }

    /**
     * @param string $currency
     * @param float|null $dollarPrice
     * @param bool $format
     * @return float|string
     */
    public function getPrice(string $currency = 'USD', float $dollarPrice = null, bool $format = false)
    {
        return convertCurrency($this->calcPrice($dollarPrice), 'USD', strtoupper($currency), $format, $this->coin->currency_precision);
    }

    /**
     * @param string $currency
     * @param float|null $dollarPrice
     * @return string
     */
    public function getFormattedPrice(string $currency = 'USD', float $dollarPrice = null)
    {
        return convertCurrency($this->calcPrice($dollarPrice), 'USD', strtoupper($currency), true, $this->coin->currency_precision);
    }
}
