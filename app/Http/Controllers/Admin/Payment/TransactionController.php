<?php

namespace App\Http\Controllers\Admin\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\PaymentTransactionResource;
use App\Models\PaymentTransaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_payments');
    }

    /**
     * Paginate transactions
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function paginate(Request $request)
    {
        $query = PaymentTransaction::latest();

        $this->filterByUser($query, $request);

        return PaymentTransactionResource::collection(paginate($query));
    }

    /**
     * Pending transfer receive
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function pendingTransferReceivePaginate(Request $request)
    {
        $query = PaymentTransaction::pendingTransfer()->where('type', 'receive');

        $this->filterByUser($query, $request);

        return PaymentTransactionResource::collection(paginate($query));
    }

    /**
     * Pending transfer send
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function pendingTransferSendPaginate(Request $request)
    {
        $query = PaymentTransaction::pendingTransfer()->where('type', 'send');

        $this->filterByUser($query, $request);

        return PaymentTransactionResource::collection(paginate($query));
    }

    /**
     * Filter query by user
     *
     * @param Builder $query
     * @param Request $request
     */
    protected function filterByUser(Builder $query, Request $request)
    {
        if ($search = $request->get('searchUser')) {
            $query->whereHas('account.user', function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Complete transfer
     *
     * @param VerifiedRequest $request
     * @param PaymentTransaction $transaction
     * @return void
     * @throws \Exception
     */
    public function completeTransfer(VerifiedRequest $request, PaymentTransaction $transaction)
    {
        if (!$transaction->isPendingTransfer()) {
            abort(403, trans('auth.action_forbidden'));
        }

        $transaction->completeTransfer();
    }

    /**
     * Cancel transfer
     *
     * @param VerifiedRequest $request
     * @param PaymentTransaction $transaction
     * @return void
     * @throws \Exception
     */
    public function cancelTransfer(VerifiedRequest $request, PaymentTransaction $transaction)
    {
        if (!$transaction->isPendingTransfer()) {
            abort(403, trans('auth.action_forbidden'));
        }

        $transaction->cancelPending();
    }
}
