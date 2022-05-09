<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\ExchangeTradeResource;
use App\Models\Earning;
use App\Models\ExchangeTrade;
use App\Models\FeatureLimit;
use App\Models\PaymentAccount;
use App\Models\User;
use App\Models\WalletAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExchangeTradeController extends Controller
{
    /**
     * Calculate sell order
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    public function calculateSell(Request $request)
    {
        $this->validateCalculateRequest($request);

        $account = $this->getAccount($request);
        $amount = $this->parseAmount($request, $account);

        $exchangeFee = $account->getExchangeFee($amount, 'sell');

        $fee = $exchangeFee->getValue();
        $deductible = $amount->add($exchangeFee)->getValue();

        return compact('deductible', 'fee');
    }

    /**
     * Sell coin
     *
     * @param VerifiedRequest $request
     * @return mixed
     */
    public function sell(VerifiedRequest $request)
    {
        return Auth::user()->acquireLock(function (User $user) use ($request) {
            $account = $this->getAccount($request);
            $this->validateActionRequest($request, $account);

            $record = $account->acquireLock(function (WalletAccount $account) use ($request, $user) {
                $limit = FeatureLimit::walletExchange();

                if (!$limit->enabled($user)) {
                    return abort(403, trans('feature.verification_required'));
                }

                $paymentAccount = $user->getPaymentAccount();
                $operator = $this->getOperator($user);

                $amount = $this->parseAmount($request, $account);
                $exchangeFee = $account->getExchangeFee($amount, 'sell');

                $deductible = $amount->add($exchangeFee);

                if ($account->getAvailableObject()->lessThan($deductible)) {
                    return abort(422, trans('wallet.insufficient_available'));
                }

                $payment = $paymentAccount->parseMoney(
                    $amount->getPrice($paymentAccount->currency)
                );

                if (!$limit->checkAvailability($payment, $user)) {
                    return abort(403, trans('feature.limit_reached'));
                }

                $exchangeTrade = new ExchangeTrade();
                $exchangeTrade->type = 'sell';
                $exchangeTrade->wallet_value = $deductible;
                $exchangeTrade->fee_value = $exchangeFee;
                $exchangeTrade->payment_value = $payment;
                $exchangeTrade->dollar_price = $amount->getDollarPrice();
                $exchangeTrade->status = 'completed';

                $exchangeTrade->trader()->associate($operator);
                $exchangeTrade->paymentAccount()->associate($paymentAccount);
                $exchangeTrade->walletAccount()->associate($account);

                DB::transaction(function () use ($exchangeTrade, $limit, $user) {
                    $exchangeTrade->save();

                    $deductible = $exchangeTrade->getWalletValueObject();
                    $fee = $exchangeTrade->getFeeValueObject();
                    $payment = $exchangeTrade->getPaymentValueObject();
                    $account = $exchangeTrade->walletAccount;
                    $traderAccount = $account->parseTarget($exchangeTrade->trader);
                    $description = $exchangeTrade->transferDescription();

                    $exchangeTrade->paymentAccount->credit($payment, $description);
                    $traderAccount->credit($deductible, $description, $exchangeTrade->dollar_price);
                    $account->debit($deductible, $description, $exchangeTrade->dollar_price);
                    Earning::wallet($fee, $description, $exchangeTrade->trader);

                    $limit->setUsage($payment, $user);
                });

                $exchangeTrade->fill(['completed_at' => now()]);
                return tap($exchangeTrade)->save();
            });

            if (!$record instanceof ExchangeTrade) {
                return abort(403, trans('common.in_use'));
            }

            return ExchangeTradeResource::make($record);
        });
    }

    /**
     * Calculate buy order
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    public function calculateBuy(Request $request)
    {
        $this->validateCalculateRequest($request);

        $account = $this->getAccount($request);
        $amount = $this->parseAmount($request, $account);

        $exchangeFee = $account->getExchangeFee($amount, 'buy');

        $currency = Auth::user()->currency;
        $deductible = $amount->add($exchangeFee)->getPrice($currency);
        $fee = $exchangeFee->getPrice($currency);

        return compact('deductible', 'fee');
    }

    /**
     * Buy coin
     *
     * @param VerifiedRequest $request
     * @return mixed
     */
    public function buy(VerifiedRequest $request)
    {
        return Auth::user()->acquireLock(function (User $user) use ($request) {
            $paymentAccount = $user->getPaymentAccount();

            $record = $paymentAccount->acquireLock(function (PaymentAccount $paymentAccount) use ($request, $user) {
                $limit = FeatureLimit::walletExchange();

                if (!$limit->enabled($user)) {
                    return abort(403, trans('feature.verification_required'));
                }

                $account = $this->getAccount($request);
                $this->validateActionRequest($request, $account);
                $operator = $this->getOperator($user);

                $amount = $this->parseAmount($request, $account);
                $exchangeFee = $account->getExchangeFee($amount, 'buy');

                $deductible = $paymentAccount->parseMoney(
                    $amount->add($exchangeFee)->getPrice($paymentAccount->currency)
                );

                if ($paymentAccount->getAvailableObject()->lessThan($deductible)) {
                    return abort(422, trans('payment.insufficient_balance'));
                }

                if (!$limit->checkAvailability($deductible, $user)) {
                    return abort(403, trans('feature.limit_reached'));
                }

                $exchangeTrade = new ExchangeTrade();
                $exchangeTrade->type = 'buy';
                $exchangeTrade->wallet_value = $amount;
                $exchangeTrade->payment_value = $deductible;
                $exchangeTrade->fee_value = $exchangeFee;
                $exchangeTrade->dollar_price = $amount->getDollarPrice();
                $exchangeTrade->status = 'pending';

                $exchangeTrade->trader()->associate($operator);
                $exchangeTrade->paymentAccount()->associate($paymentAccount);
                $exchangeTrade->walletAccount()->associate($account);
                return tap($exchangeTrade)->save();
            });

            if (!$record instanceof ExchangeTrade) {
                return abort(403, trans('common.in_use'));
            }

            return ExchangeTradeResource::make($record);
        });
    }

    /**
     * Paginate exchange trades
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function paginate(Request $request)
    {
        $query = Auth::user()->exchangeTrades();

        if ($account = $request->get('account')) {
            $query = $query->where('wallet_accounts.id', $account);
        }

        $records = paginate($query->latest());

        return ExchangeTradeResource::collection($records);
    }

    /**
     * Validate calculate request
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    protected function validateCalculateRequest(Request $request)
    {
        return $this->validate($request, [
            'amount' => 'nullable|numeric|min:0'
        ]);
    }

    /**
     * Validate action request
     *
     * @param VerifiedRequest $request
     * @param WalletAccount $account
     * @return array
     * @throws ValidationException
     */
    protected function validateActionRequest(VerifiedRequest $request, WalletAccount $account)
    {
        return $this->validate($request, [
            'amount' => [
                'required', 'numeric',
                "min:{$account->min_transferable}",
                "max:{$account->max_transferable}",
            ]
        ]);
    }

    /**
     * Parse amount
     *
     * @param Request $request
     * @param WalletAccount $account
     * @return \App\Helpers\CoinFormatter
     */
    protected function parseAmount(Request $request, WalletAccount $account)
    {
        return coin($request->get('amount') ?: 0, $account->wallet->coin, true);
    }

    /**
     * Get wallet account
     *
     * @param Request $request
     * @return \App\Models\WalletAccount
     */
    protected function getAccount(Request $request)
    {
        return $this->walletAccounts()->findOrFail($request->get('account'));
    }

    /**
     * Get operator
     *
     * @param User $user
     * @return User
     */
    protected function getOperator(User $user)
    {
        return tap(User::exchangeOperator(), function ($operator) use ($user) {
            if (!$operator instanceof User) {
                return abort(403, trans('common.operator_unavailable'));
            }

            if ($user->is($operator)) {
                return abort(403, trans('wallet.cannot_trade_with_yourself'));
            }
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
