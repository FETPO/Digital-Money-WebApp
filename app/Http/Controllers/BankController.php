<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\BankResource;
use App\Models\Bank;
use App\Models\BankAccount;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BankController extends Controller
{
    /**
     * Get banks for user's country
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function get()
    {
        return BankResource::collection(Auth::user()->getOperatingBanks()->get());
    }

    /**
     * Get bank accounts
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getAccounts()
    {
        $accounts = Auth::user()->bankAccounts()->get();
        return BankAccountResource::collection($accounts);
    }

    /**
     * Create bank account
     *
     * @param VerifiedRequest $request
     */
    public function createAccount(VerifiedRequest $request)
    {
        Auth::user()->acquireLock(function (User $user) use ($request) {
            if ($user->bankAccounts()->count() >= 6) {
                abort(403, trans('bank.account_limit'));
            }

            if (!$user->country_operation) {
                abort(403, trans('bank.unavailable_country'));
            }

            $validated = $this->validate($request, [
                'note'   => 'nullable|string|max:1000',
                'number' => 'required|string|max:255',
            ]);

            $account = new BankAccount();
            $account->fill($validated);

            if ($request->get('bank_id') == 'other') {
                $input = $this->validate($request, [
                    'bank_name' => 'required|string|min:5|max:255'
                ]);
                $account->bank_name = $input['bank_name'];
            } else {
                $input = $this->validate($request, [
                    'bank_id' => 'required|exists:banks,id'
                ]);
                $bank = $user->getOperatingBanks()->findOrFail($input['bank_id']);
                $account->bank()->associate($bank);
            }

            $account->currency = $user->currency;
            $account->country = $user->country;
            $user->bankAccounts()->save($account);
        });
    }

    /**
     * Delete account
     *
     * @param $id
     */
    public function deleteAccount($id)
    {
        Auth::user()->bankAccounts()->findOrFail($id)->delete();
    }
}
