<?php

namespace App\Http\Controllers;

use App\Exceptions\TransferException;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\PaymentAccountResource;
use App\Http\Resources\PaymentTransactionResource;
use App\Models\FeatureLimit;
use App\Models\PaymentAccount;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use NeoScrypts\Multipay\Order;

class PaymentController extends Controller
{
    /**
     * Get current user's payment
     *
     * @return PaymentAccountResource
     */
    public function getAccount()
    {
        return PaymentAccountResource::make(Auth::user()->getPaymentAccount());
    }

    /**
     * Get daily chart data
     *
     * @return array
     */
    public function getDailyChart()
    {
        return Auth::user()->getPaymentAccount()->getDailyChartData();
    }

    /**
     * Withdraw request
     *
     * @param Request $request
     * @return mixed
     */
    public function withdraw(Request $request)
    {
        return Auth::user()->acquireLock(function (User $user) use ($request) {
            $limit = FeatureLimit::paymentsWithdrawal();

            if (!$limit->enabled($user)) {
                abort(403, trans('feature.verification_required'));
            }

            $account = $user->getPaymentAccount();

            $minAmount = $account->min_transferable;
            $maxAmount = $account->max_transferable;

            $data = $this->validate($request, [
                'amount'       => "required|numeric|min:$minAmount|max:$maxAmount",
                'bank_account' => "required|exists:bank_accounts,id",
            ]);

            $bankAccount = $user->bankAccounts()->findOrFail($data['bank_account']);
            $amount = $account->parseMoney($data['amount']);

            if (!$limit->checkAvailability($amount, $user)) {
                abort(403, trans('feature.limit_reached'));
            }

            return $account->sendViaTransfer($amount, $bankAccount);
        });
    }

    /**
     * Deposit action
     *
     * @param Request $request
     * @return mixed
     */
    public function deposit(Request $request)
    {
        return Auth::user()->acquireLock(function (User $user) use ($request) {
            $account = $user->getPaymentAccount();

            return $account->acquireLock(function (PaymentAccount $account) use ($request) {
                $limit = FeatureLimit::paymentsDeposit();

                if (!$limit->enabled($account->user)) {
                    abort(403, trans('feature.verification_required'));
                }

                $minAmount = $account->min_transferable;
                $maxAmount = $account->max_transferable;

                if ($account->hasMaximumPending()) {
                    abort(403, trans('payment.reached_pending_threshold'));
                }

                $allowedMethods = array_merge($this->supportedGateways($account->user), ['transfer']);

                $data = $this->validate($request, [
                    'amount' => "required|numeric|min:$minAmount|max:$maxAmount",
                    'method' => ["required", "string", Rule::in($allowedMethods)]
                ]);

                $amount = $account->parseMoney($data['amount']);

                if (!$limit->checkAvailability($amount, $account->user)) {
                    abort(403, trans('feature.limit_reached'));
                }

                if ($data['method'] == "transfer") {
                    if (!$bankAccount = $account->user->getDepositBankAccount()) {
                        abort(422, trans('bank.unavailable_country'));
                    }

                    $account->receiveViaTransfer($amount, $bankAccount);
                } else {
                    $gatewayData = new Collection();
                    $order = new Order($account->currency, $amount->getValue());
                    $gateway = app('multipay')->gateway($data['method']);

                    $gatewayData->put('name', $data['method']);
                    $gatewayData->put('uuid', $order->getUuid());

                    $gateway->request($order, function ($ref, $url) use ($gatewayData) {
                        $gatewayData->put('ref', $ref);
                        $gatewayData->put('url', $url);
                    });

                    $account->receiveViaGateway($amount, $gatewayData);

                    return $request->wantsJson() ?
                        response()->json(['redirect' => $gatewayData->get('url')]) :
                        redirect()->away($gatewayData->get('url'));
                }
            });
        });
    }

    /**
     * Paginate payment transaction
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function transactionPaginate()
    {
        $transactions = paginate(Auth::user()->getPaymentAccount()->transactions()->latest());
        return PaymentTransactionResource::collection($transactions);
    }

    /**
     * Get deposit methods
     *
     * @return array
     */
    public function getDepositMethods()
    {
        return [
            'transfer' => BankAccountResource::make(Auth::user()->getDepositBankAccount()),
            'gateways' => $this->supportedGateways(Auth::user())
        ];
    }

    /**
     * Get supported gateways
     *
     * @param User $user
     * @return array
     */
    protected function supportedGateways(User $user)
    {
        $gateways = config('multipay.gateways');

        return collect($gateways)->keys()
            ->filter(function ($gateway) use ($user) {
                $supported = app('multipay')->gateway($gateway)
                    ->supportsCurrency($user->currency);

                $enabled = rescue(function () use ($gateway) {
                    return settings()->gateway->get($gateway);
                }, false, false);

                return $supported && $enabled;
            })->values()->toArray();
    }
}
