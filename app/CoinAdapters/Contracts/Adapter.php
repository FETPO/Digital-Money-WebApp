<?php
/**
 * ======================================================================================================
 * File Name: Adapter.php
 * ======================================================================================================
 * Author: HolluwaTosin360
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 12/30/2020 (5:19 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\CoinAdapters\Contracts;


use App\CoinAdapters\Resources\Address;
use App\CoinAdapters\Resources\Transaction;
use App\CoinAdapters\Resources\Wallet;

interface Adapter
{
    /**
     * Get adapter name
     *
     * @return string
     */
    public function adapterName(): string;

    /**
     * Get coin name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Get coin identifier
     *
     * @return string
     */
    public function getIdentifier(): string;

    /**
     * Get coin unit
     *
     * @return mixed
     */
    public function getBaseUnit();

    /**
     * Get coin precision
     *
     * @return int|float
     */
    public function getPrecision();

    /**
     * Get currency precision
     *
     * @return mixed
     */
    public function getCurrencyPrecision();

    /**
     * Get coin symbol
     *
     * @return mixed
     */
    public function getSymbol(): string;

    /**
     * Show symbol first
     *
     * @return bool
     */
    public function showSymbolFirst(): bool;

    /**
     * Get color used for highlighting
     *
     * @return string
     */
    public function getColor(): string;

    /**
     * Get svg icon json
     *
     * @return array|string
     */
    public function getSvgIcon();

    /**
     * Generate wallet
     *
     * @param string $label
     * @param string $passphrase
     * @return Wallet
     */
    public function createWallet(string $label, string $passphrase): Wallet;

    /**
     * Create address for users
     *
     * @param Wallet $wallet
     * @param $label
     * @return Address
     */
    public function createAddress(Wallet $wallet, $label = 'Default'): Address;

    /**
     * Send transaction
     *
     * @param Wallet $wallet
     * @param string $address
     * @param $amount
     * @param $passphrase
     * @return Transaction
     */
    public function send(Wallet $wallet, string $address, $amount, $passphrase);

    /**
     * Get wallet transaction by id
     *
     * @param Wallet $wallet
     * @param $id
     * @return Transaction
     */
    public function getTransaction(Wallet $wallet, $id): Transaction;

    /**
     * Handle coin webhook and return the transaction data
     *
     * @param Wallet $wallet
     * @param $payload
     * @return Transaction|null
     */
    public function handleTransactionWebhook(Wallet $wallet, $payload);

    /**
     * Add webhook for wallet.
     *
     * @param Wallet $wallet
     * @param int $minConf
     * @return mixed
     */
    public function setTransactionWebhook(Wallet $wallet, int $minConf = 3);

    /**
     * Reset webhook for wallet.
     *
     * @param Wallet $wallet
     * @param int $minConf
     * @return mixed
     */
    public function resetTransactionWebhook(Wallet $wallet, int $minConf = 3);

    /**
     * Get the dollar price
     *
     * @return float
     */
    public function getDollarPrice(): float;

    /**
     * Get last 24hr change
     *
     * @return float
     */
    public function getDollarPriceChange(): float;

    /**
     * Get market chart
     *
     * @param int $days
     * @return array
     */
    public function marketChart(int $days): array;

    /**
     * Estimate the transaction fee
     *
     * @param integer $inputs
     * @param integer $outputs
     * @param $amount
     * @param int|null $minConf
     * @return string
     */
    public function estimateTransactionFee(int $inputs, int $outputs, $amount = 0, int $minConf = null);

    /**
     * Get minimum transferable amount.
     *
     * @return mixed
     */
    public function getMinimumTransferable();

    /**
     * Get maximum transferable amount.
     *
     * @return mixed
     */
    public function getMaximumTransferable();
}
