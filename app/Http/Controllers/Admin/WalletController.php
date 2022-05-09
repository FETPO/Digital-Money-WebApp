<?php

namespace App\Http\Controllers\Admin;

use App\CoinAdapters\Contracts\Adapter;
use App\CoinAdapters\Contracts\Consolidates;
use App\CoinAdapters\Resources\Transaction;
use App\Helpers\CoinManager;
use App\Http\Controllers\Controller;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\TransferRecordResource;
use App\Http\Resources\WalletResource;
use App\Models\Coin;
use App\Models\TransferRecord;
use App\Models\Wallet;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class WalletController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_wallets');
    }

    /**
     * Get adapters
     *
     * @return Collection
     */
    public function getAdapters()
    {
        return $this->adapters();
    }

    /**
     * Create wallet
     *
     * @param Request $request
     * @throws ValidationException
     * @throws \Throwable
     */
    public function create(Request $request)
    {
        Auth::user()->acquireLock(function () use ($request) {
            $adapters = $this->adapters()->pluck('class');

            $validated = $this->validate($request, [
                'min_conf' => ['required', 'numeric', 'min:1'],
                'adapter'  => ['required', Rule::in($adapters->all())]
            ]);

            DB::transaction(function () use ($validated) {
                $minConf = $validated['min_conf'];
                $adapter = new $validated['adapter'];
                $manager = CoinManager::use($adapter, $minConf);
                return $manager->createWallet();
            });
        });
    }

    /**
     * Delete wallet
     *
     * @param $identifier
     */
    public function delete($identifier)
    {
        Coin::where('identifier', $identifier)
            ->whereDoesntHave('wallet.accounts')
            ->delete();
    }

    /**
     * Reset webhook
     *
     * @param $identifier
     */
    public function resetWebhook($identifier)
    {
        $coin = $this->getCoin($identifier);
        $coin->adapter->resetTransactionWebhook($coin->wallet->resource);
    }

    /**
     * Consolidate address funds
     *
     * @param Request $request
     * @param $identifier
     * @throws ValidationException
     */
    public function consolidate(Request $request, $identifier)
    {
        $validated = $this->validate($request, [
            'address' => 'required|string'
        ]);

        $coin = $this->getCoin($identifier);

        if ($coin->adapter instanceof Consolidates) {
            try {
                $coin->adapter->consolidate(
                    $coin->wallet->resource,
                    $validated['address'],
                    $coin->wallet->passphrase
                );
            } catch (RequestException $e) {
                return abort(422, $e->response->body());
            }
        }
    }

    /**
     * Relay transaction
     *
     * @param Request $request
     * @param $identifier
     * @throws ValidationException
     * @throws Exception
     */
    public function relayTransaction(Request $request, $identifier)
    {
        $validated = $this->validate($request, [
            'hash' => 'required|string'
        ]);

        $coin = $this->getCoin($identifier);

        try {
            $resource = $coin->adapter->getTransaction($coin->wallet->resource, $validated['hash']);

            if ($resource instanceof Transaction) {
                $coin->saveTransactionResource($resource);
            }
        } catch (Exception $e) {
            return abort(422, $e->getMessage());
        }
    }

    /**
     * Paginate wallets
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function paginate(Request $request)
    {
        $query = Wallet::with('statistic')->withCount('accounts');

        $this->filterByCoin($query, $request);

        return WalletResource::collection(paginate($query));
    }

    /**
     * Paginate transfer records
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function transferRecordPaginate(Request $request)
    {
        $query = TransferRecord::latest();

        $this->filterTransferRecordByUser($query, $request);

        return TransferRecordResource::collection(paginate($query));
    }

    /**
     * Remove transfer record
     *
     * @param VerifiedRequest $request
     * @param TransferRecord $record
     * @return void
     */
    public function transferRecordRemove(VerifiedRequest $request, TransferRecord $record)
    {
        $record->acquireLock(function (TransferRecord $record) {
            if ($record->isRemovable()) {
                return $record->delete();
            }
        });
    }

    /**
     * Get withdrawal fees
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getWithdrawalFees()
    {
        return WalletResource::collection(Wallet::with('withdrawalFee')->get());
    }

    /**
     * Update withdrawal fees
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateWithdrawalFees(Request $request)
    {
        $identifiers = Coin::all()->pluck('identifier');

        $validated = $this->validate($request, [
            'fees'         => 'required|array:' . $identifiers->implode(","),
            'fees.*'       => 'required|array:type,value',
            'fees.*.type'  => 'required|in:fixed,percent',
            'fees.*.value' => 'required|numeric|min:0',
        ]);

        foreach ($validated['fees'] as $identifier => $data) {
            $wallet = Wallet::identifier($identifier)->firstOrFail();
            $withdrawalFee = $wallet->withdrawalFee()->firstOrNew();
            $withdrawalFee->fill($data)->save();
        }
    }

    /**
     * Get exchange fee
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getExchangeFees()
    {
        return WalletResource::collection(Wallet::with('exchangeFees')->get());
    }

    /**
     * Update exchange fees
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateExchangeFees(Request $request)
    {
        $identifiers = Coin::all()->pluck('identifier');

        $validated = $this->validate($request, [
            'fees'           => 'required|array:' . $identifiers->implode(","),
            'fees.*'         => 'required|array:buy,sell',
            'fees.*.*'       => 'required|array:type,value',
            'fees.*.*.type'  => 'required|in:fixed,percent',
            'fees.*.*.value' => 'required|numeric|min:0',
        ]);

        foreach ($validated['fees'] as $identifier => $categories) {
            $wallet = Wallet::identifier($identifier)->firstOrFail();

            foreach ($categories as $category => $attributes) {
                $wallet->exchangeFees()->firstOrNew(compact('category'))
                    ->fill($attributes)->save();
            }
        }
    }

    /**
     * Filter query by coin
     *
     * @param Builder $query
     * @param Request $request
     */
    protected function filterByCoin(Builder $query, Request $request)
    {
        if ($search = $request->get('searchCoin')) {
            $query->whereHas('coin', function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Filter query by user
     *
     * @param Builder $query
     * @param Request $request
     */
    protected function filterTransferRecordByUser(Builder $query, Request $request)
    {
        if ($search = $request->get('searchUser')) {
            $query->whereHas('walletAccount.user', function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Adapter collection
     *
     * @return Collection
     */
    protected function adapters()
    {
        return app('coin.adapters')
            ->filter(function ($className) {
                return class_exists($className);
            })
            ->map(function ($className) {
                return new $className;
            })
            ->filter(function ($adapter) {
                return $adapter instanceof Adapter;
            })
            ->filter(function ($adapter) {
                return Coin::whereIdentifier($adapter->getIdentifier())->doesntExist();
            })
            ->map(function (Adapter $adapter) {
                return [
                    'class'      => get_class($adapter),
                    'name'       => $adapter->adapterName(),
                    'identifier' => $adapter->getIdentifier(),
                    'symbol'     => $adapter->getSymbol(),
                ];
            })->values();
    }

    /**
     * Get coin by identifier
     *
     * @param string $identifier
     * @return Coin
     */
    protected function getCoin(string $identifier)
    {
        return Coin::has("wallet")->whereIdentifier($identifier)->firstOrFail();
    }
}
