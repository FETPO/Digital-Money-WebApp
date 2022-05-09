<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\BankResource;
use App\Http\Resources\OperatingCountryResource;
use App\Models\Bank;
use App\Models\BankAccount;
use App\Models\OperatingCountry;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BankController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_banks');
    }

    /**
     * Paginate bank
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(Bank::latest()->with('operatingCountries'));

        return BankResource::collection($records);
    }

    /**
     * Create bank
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function create(Request $request)
    {
        $operatingCountries = $this->operatingCountries()->pluck('code');

        $validated = $this->validate($request, [
            'name'                  => ['required', 'string', 'max:250', 'unique:banks'],
            'operating_countries'   => ['required', 'array'],
            'operating_countries.*' => ['required', Rule::in($operatingCountries)]
        ]);

        $bank = Bank::create(['name' => $validated['name']]);

        $bank->operatingCountries()->sync($validated['operating_countries']);
    }

    /**
     * Update bank
     *
     * @param Request $request
     * @param Bank $bank
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request, Bank $bank)
    {
        $operatingCountries = $this->operatingCountries()->pluck('code');

        $validated = $this->validate($request, [
            'name'                  => ['required', 'string', 'max:250', $this->uniqueRule($bank)],
            'operating_countries'   => ['required', 'array'],
            'operating_countries.*' => ['required', Rule::in($operatingCountries)]
        ]);

        $bank->update(['name' => $validated['name']]);

        $bank->operatingCountries()->sync($validated['operating_countries']);
    }

    /**
     * Delete bank
     *
     * @param Bank $bank
     */
    public function delete(Bank $bank)
    {
        $bank->delete();
    }

    /**
     * Upload logo
     *
     * @param Request $request
     * @param Bank $bank
     * @throws \Illuminate\Validation\ValidationException
     */
    public function setLogo(Request $request, Bank $bank)
    {
        $this->validate($request, [
            'file' => 'required|mimetypes:image/png,image/jpeg|dimensions:ratio=1|file|max:100'
        ]);

        $file = $request->file('file');
        $logo = savePublicFile($file, $bank->path(), "logo.{$file->extension()}");
        $bank->update(['logo' => $logo]);
    }

    /**
     * Get unique rule
     *
     * @return \Illuminate\Validation\Rules\Unique
     */
    protected function uniqueRule(Bank $bank)
    {
        return Rule::unique('banks')->ignore($bank);
    }

    /**
     * Paginate operating countries
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function operatingCountryPaginate()
    {
        $records = paginate(OperatingCountry::withCount('banks'));

        return OperatingCountryResource::collection($records);
    }

    /**
     * Create operating country
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createOperatingCountry(Request $request)
    {
        $available = $this->availableCountries();

        $validated = $this->validate($request, [
            'code' => ['required', Rule::in($available->pluck('code'))],
        ]);

        $country = collect($available->firstWhere('code', $validated['code']));

        OperatingCountry::create([
            'code' => $country->get('code'),
            'name' => $country->get('name'),
        ]);
    }

    /**
     * Remove operating country
     *
     * @param OperatingCountry $country
     */
    public function deleteOperatingCountry(OperatingCountry $country)
    {
        $country->delete();
    }

    /**
     * Paginate accounts
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function accountPaginate()
    {
        $query = BankAccount::doesntHave('user')
            ->has('supportedCurrency')->has('bank.operatingCountries')
            ->latest();

        return BankAccountResource::collection(paginate($query));
    }

    /**
     * Create bank account
     *
     * @param VerifiedRequest $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createAccount(VerifiedRequest $request)
    {
        $validated = $this->validate($request, [
            'bank_id'     => 'required|exists:banks,id',
            'beneficiary' => 'required|string|max:250',
            'number'      => 'required|string|max:255',
            'currency'    => 'required|exists:supported_currencies,code',
            'country'     => 'required|exists:operating_countries,code',
            'note'        => 'nullable|string|max:1000',
        ]);

        $account = new BankAccount(Arr::except($validated, ['bank_id']));
        $bank = Bank::country($validated['country'])->findOrFail($validated['bank_id']);
        $account->bank()->associate($bank)->save();
    }

    /**
     * Delete account
     *
     * @param BankAccount $account
     */
    public function deleteAccount(BankAccount $account)
    {
        $account->delete();
    }

    /**
     * Get available countries
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAvailableCountries()
    {
        return $this->availableCountries()->values();
    }

    /**
     * Get operating banks
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getOperatingBanks()
    {
        $banks = Bank::latest()->has('operatingCountries')
            ->with('operatingCountries')->get();

        return BankResource::collection($banks);
    }

    /**
     * Available countries
     *
     * @return \Illuminate\Support\Collection
     */
    protected function availableCountries()
    {
        $existing = $this->operatingCountries()
            ->pluck('code')->toArray();

        return collect(config('countries'))
            ->filter(function ($name, $code) use ($existing) {
                return !in_array($code, $existing);
            })
            ->map(function ($name, $code) {
                return compact('name', 'code');
            });
    }

    /**
     * All operating country codes
     *
     * @return \Illuminate\Support\Collection
     */
    protected function operatingCountries()
    {
        return OperatingCountry::all();
    }
}
