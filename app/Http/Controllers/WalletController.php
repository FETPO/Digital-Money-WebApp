<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransferRecordResource;
use App\Http\Resources\WalletResource;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class WalletController extends Controller
{
    /**
     * Market chart days range
     *
     * @var int[]
     */
    protected $chartRange = [
        'hour'  => 1,
        'day'   => 1,
        'week'  => 7,
        'month' => 30,
        'year'  => 365,
    ];

    /**
     * Add account with wallet
     *
     * @param Wallet $wallet
     * @return \App\Models\WalletAccount|mixed
     */
    public function createAccount(Wallet $wallet)
    {
        return Auth::user()->acquireLock(function (User $user) use ($wallet) {
            return WalletResource::make($wallet->getAccount($user));
        });
    }

    /**
     * Get all wallet unused by this user
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function unused()
    {
        $used = Auth::user()->walletAccounts()->get()
            ->pluck('wallet_id')->toArray();

        $wallets = Wallet::whereNotIn('id', $used)->get();

        return WalletResource::collection($wallets);
    }

    /**
     * Paginate transfer record
     *
     * @param Request $request
     * @return mixed
     */
    public function transferRecordPaginate(Request $request)
    {
        $query = Auth::user()->transferRecords();

        if ($account = $request->get('account')) {
            $query = $query->where('wallet_accounts.id', $account);
        }

        $records = paginate($query->latest());

        return TransferRecordResource::collection($records);
    }

    /**
     * Get price
     *
     * @param Wallet $wallet
     * @return array
     */
    public function price(Wallet $wallet)
    {
        return [
            'price'           => $wallet->getPrice(Auth::user()->currency),
            'formatted_price' => $wallet->getFormattedPrice(Auth::user()->currency),
            'change'          => $wallet->getPriceChange(),
        ];
    }

    /**
     * Get market chart
     *
     * @param Request $request
     * @param Wallet $wallet
     * @return Collection
     * @throws ValidationException
     */
    public function marketChart(Request $request, Wallet $wallet)
    {
        $validated = $this->validate($request, [
            'range' => 'required|in:hour,day,week,month,year'
        ]);

        $days = collect($this->chartRange)->get($validated['range']);

        return $wallet->marketChart($days, Auth::user()->currency);
    }
}
