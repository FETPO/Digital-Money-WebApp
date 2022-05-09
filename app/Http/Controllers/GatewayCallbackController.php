<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPendingPaymentTransaction;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GatewayCallbackController extends Controller
{
    /**
     * Handle paypal callback
     *
     * @param Request $request
     * @param $order
     * @return mixed
     */
    public function handlePaypal(Request $request, $order)
    {
        try {
            if ($request->get('status') != "success") {
                abort(422, trans('payment.gateway_cancelled'));
            }

            $account = Auth::user()->getPaymentAccount();
            $transaction = $account->transactions()->findOrFail($order);

            ProcessPendingPaymentTransaction::dispatch($transaction);

            return redirect()->route('index')
                ->notify(trans('payment.gateway_approved'), "success");
        } catch (Exception $e) {
            return redirect()->route('index')
                ->notify($e->getMessage(), "error");
        }
    }
}
