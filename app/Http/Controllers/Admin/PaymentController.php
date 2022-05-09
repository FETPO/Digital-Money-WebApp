<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupportedCurrencyResource;
use App\Models\SupportedCurrency;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * @var \NeoScrypts\Exchanger\Drivers\AbstractDriver
     */
    protected $exchangeDriver;

    /**
     * @var string
     */
    protected string $baseCurrency;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_payments');
        $this->baseCurrency = strtoupper(app('exchanger')->config('base_currency'));
        $this->exchangeDriver = app('exchanger')->getDriver();
    }

    /**
     * Paginate supported currency records
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function supportedCurrencyPaginate()
    {
        $query = SupportedCurrency::with('statistic')->withCount('paymentAccounts');

        return SupportedCurrencyResource::collection(paginate($query));
    }

    /**
     * Get currencies
     *
     * @return \Illuminate\Support\Collection
     */
    public function getCurrencies()
    {
        return $this->availableCurrencies()->values();
    }

    /**
     * Add supported currency
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createSupportedCurrency(Request $request)
    {
        $available = $this->availableCurrencies();

        $validated = $this->validate($request, [
            'code'          => ['required', Rule::in($available->pluck('code'))],
            'exchange_rate' => ['nullable', 'required_if:manual,true', 'numeric', 'min:0', 'max:999999'],
            'manual'        => ['required', 'boolean'],
        ]);

        $currency = collect($available->firstWhere('code', $validated['code']));

        SupportedCurrency::create([
            'code' => $currency->get('code'),
            'name' => $currency->get('name'),
        ]);

        if ($validated['manual'] && $this->baseCurrency != $currency->get('code')) {
            $this->exchangeDriver->update($currency->get('code'), [
                'type'          => 'manual',
                'exchange_rate' => $validated['exchange_rate']
            ]);
        } else {
            $this->exchangeDriver->update($currency->get('code'), ['type' => 'auto']);

            Artisan::call('exchanger:update');
        }
    }

    /**
     * Delete supported currency
     *
     * @param SupportedCurrency $currency
     */
    public function deleteSupportedCurrency(SupportedCurrency $currency)
    {
        if ($currency->default) {
            return abort(403, trans('auth.action_forbidden'));
        }
        $currency->delete();
    }

    /**
     * Make default
     *
     * @param SupportedCurrency $currency
     * @return mixed|void
     * @throws \Throwable
     */
    public function makeSupportedCurrencyDefault(SupportedCurrency $currency)
    {
        if ($currency->default) {
            return abort(403, trans('auth.action_forbidden'));
        }

        DB::transaction(function () use ($currency) {
            SupportedCurrency::default()->update(['default' => false]);

            $currency->update(['default' => true]);
        });
    }

    /**
     * Update rate
     *
     * @param Request $request
     * @param SupportedCurrency $currency
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateSupportedCurrency(Request $request, SupportedCurrency $currency)
    {
        $validated = $this->validate($request, [
            'exchange_rate' => ['nullable', 'required_if:manual,true', 'numeric', 'min:0', 'max:999999'],
            'manual'        => ['required', 'boolean'],
        ]);

        if ($validated['manual'] && $this->baseCurrency != $currency->code) {
            $this->exchangeDriver->update($currency->code, [
                'type'          => 'manual',
                'exchange_rate' => $validated['exchange_rate']
            ]);
        } else {
            $this->exchangeDriver->update($currency->code, ['type' => 'auto']);

            Artisan::call('exchanger:update');
        }
    }

    /**
     * Available currencies
     *
     * @return \Illuminate\Support\Collection
     */
    protected function availableCurrencies()
    {
        $existing = SupportedCurrency::all()->pluck('code')->toArray();
        $currencies = $this->exchangeDriver->all();

        return collect($currencies)->filter(function ($record) use ($existing) {
            return !in_array(Arr::get($record, 'code'), $existing)
                && is_numeric(Arr::get($record, 'exchange_rate'));
        });
    }
}
