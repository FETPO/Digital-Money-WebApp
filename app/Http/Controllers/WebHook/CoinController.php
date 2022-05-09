<?php

namespace App\Http\Controllers\WebHook;

use App\CoinAdapters\Contracts\Approval;
use App\CoinAdapters\Resources\PendingApproval;
use App\CoinAdapters\Resources\Transaction;
use App\Http\Controllers\Controller;
use App\Models\Coin;
use Illuminate\Http\Request;

class CoinController extends Controller
{
    /**
     * Handle transaction webhook for coin
     *
     * @param Request $request
     * @param $identifier
     * @return void
     * @throws \Exception
     */
    public function handleTransactionWebhook(Request $request, $identifier)
    {
        if ($coin = $this->getCoinByIdentifier($identifier)) {
            $resource = $coin->adapter->handleTransactionWebhook($coin->wallet->resource, $request->all());

            if ($resource instanceof Transaction) {
                $coin->saveTransactionResource($resource);
            }
        }
    }

    /**
     * Handle pending approval webhook for coin
     *
     * @param Request $request
     * @param $identifier
     * @return void
     * @throws \Exception
     */
    public function handlePendingApprovalWebhook(Request $request, $identifier)
    {
        if ($coin = $this->getCoinByIdentifier($identifier)) {
            if ($coin->adapter instanceof Approval) {
                $resource = $coin->adapter->handlePendingApprovalWebhook($coin->wallet->resource, $request->all());

                if ($resource instanceof PendingApproval) {
                    $coin->savePendingApprovalResource($resource);
                }
            }
        }
    }

    /**
     * Get coin model
     *
     * @param $identifier
     * @return Coin
     */
    protected function getCoinByIdentifier($identifier)
    {
        return Coin::where('identifier', $identifier)->first();
    }
}
