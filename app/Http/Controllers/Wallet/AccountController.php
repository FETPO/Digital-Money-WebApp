<?php

namespace App\Http\Controllers\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\TransferRecordResource;
use App\Http\Resources\WalletAccountResource;
use App\Http\Resources\WalletAddressResource;
use App\Models\TransferRecord;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    /**
     * Get all wallet accounts
     *
     * @return AnonymousResourceCollection
     */
    public function all()
    {
        $accounts = $this->walletAccounts()->get()
            ->tap(function ($accounts) use (&$totalAvailablePrice) {
                $totalAvailablePrice = $accounts->sum('available_price');
            })
            ->each(function ($account) use ($totalAvailablePrice) {
                $divisor = $totalAvailablePrice > 0 ? $totalAvailablePrice : 1;
                $quota = ceil(($account->available_price * 100) / $divisor);
                $account->setAttribute('available_price_quota', $quota);
            });

        return WalletAccountResource::collection($accounts);
    }

    /**
     * Get total available price
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function totalAvailablePrice()
    {
        $price = $this->walletAccounts()
            ->get()->sum('available_price');

        $formattedPrice = formatCurrency($price, Auth::user()->currency);

        return response()->json([
            'price'          => $price,
            'formattedPrice' => $formattedPrice,
        ]);
    }

    /**
     * Get aggregate price
     *
     * @return array
     */
    public function aggregatePrice()
    {
        $accounts = $this->walletAccounts()->get();

        $available = $accounts->sum('available_price');
        $formattedAvailable = formatCurrency($available, Auth::user()->currency);

        $balanceOnTrade = $accounts->sum('balance_on_trade_price');
        $formattedBalanceOnTrade = formatCurrency($balanceOnTrade, Auth::user()->currency);

        $balance = $accounts->sum('balance_price');
        $formattedBalance = formatCurrency($balance, Auth::user()->currency);

        return [
            'available'                  => $available,
            'formatted_available'        => $formattedAvailable,
            'balance_on_trade'           => $balanceOnTrade,
            'formatted_balance_on_trade' => $formattedBalanceOnTrade,
            'balance'                    => $balance,
            'formatted_balance'          => $formattedBalance
        ];
    }

    /**
     * Estimate transaction fee
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException
     */
    public function estimateFee(Request $request, $id)
    {
        $this->validate($request, ['amount' => 'nullable|numeric|min:0']);

        $account = $this->walletAccounts()->findOrFail($id);
        $amount = coin($request->get('amount') ?: 0, $account->wallet->coin, true);

        $fee = $account->getTransactionFee($amount)->add($account->getWithdrawalFee($amount));

        return response()->json([
            'value_price'           => $fee->getPrice($account->user->currency),
            'formatted_value_price' => $fee->getFormattedPrice($account->user->currency),
            'value'                 => $fee->getValue(),
        ]);
    }

    /**
     * Send amount
     *
     * @param VerifiedRequest $request
     * @param $id
     * @return TransferRecordResource
     */
    public function send(VerifiedRequest $request, $id)
    {
        return Auth::user()->acquireLock(function () use ($request, $id) {
            $account = $this->walletAccounts()->findOrFail($id);

            $data = $this->validate($request, [
                'amount'  => [
                    'required', 'numeric',
                    "min:{$account->min_transferable}",
                    "max:{$account->max_transferable}",
                ],
                'address' => ['required'],
            ]);

            $record = $account->send($data['amount'], $data['address']);

            if (!$record instanceof TransferRecord) {
                abort(403, trans('wallet.account_in_use'));
            }

            return TransferRecordResource::make($record);
        });
    }

    /**
     * Get latest address
     *
     * @param $id
     * @return WalletAddressResource
     */
    public function latestAddress($id)
    {
        $address = $this->walletAccounts()->findOrFail($id)
            ->walletAddresses()->latest()->first();

        return WalletAddressResource::make($address);
    }

    /**
     * Generate address
     *
     * @param $id
     * @return WalletAddressResource
     * @throws \Exception
     */
    public function generateAddress($id)
    {
        $account = $this->walletAccounts()->findOrFail($id);

        return $account->acquireLock(function () use ($account) {
            $latest = $account->walletAddresses()
                ->latest()->first();

            if ($latest && !$latest->total_received) {
                abort(403, trans('wallet.last_address_not_used'));
            }

            $address = $account->wallet->createAddress($account);

            return WalletAddressResource::make($address);
        });
    }

    /**
     * Get authenticated user's wallet account
     *
     * @return \App\Models\WalletAccount|\Illuminate\Database\Eloquent\Relations\HasMany
     */
    private function walletAccounts()
    {
        return Auth::user()->walletAccounts();
    }
}
