<?php

namespace App\CoinAdapters\Contracts;

use App\CoinAdapters\Resources\PendingApproval;
use App\CoinAdapters\Resources\Wallet;

interface Approval
{
    /**
     * Get pending approval
     *
     * @param Wallet $wallet
     * @param $id
     * @return PendingApproval
     */
    public function getPendingApproval(Wallet $wallet, $id): PendingApproval;

    /**
     * Handle coin webhook and return the pending approval data
     *
     * @param Wallet $wallet
     * @param $payload
     * @return PendingApproval|void
     */
    public function handlePendingApprovalWebhook(Wallet $wallet, $payload);
}