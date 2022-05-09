<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SettingsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_settings');
    }

    /**
     * Get all settings
     *
     * @return array
     */
    public function get()
    {
        return settings()->all();
    }

    /**
     * Update settings
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function update(Request $request)
    {
        $validated = $this->validate($request, [
            'user_setup'      => 'required|boolean',
            'enable_mail'     => 'required|boolean',
            'enable_database' => 'required|boolean',
            'enable_sms'      => 'required|boolean',
            'min_payment'     => 'required|integer|min:5',
            'max_payment'     => 'required|integer|gt:min_payment|max:999999',
            'price_cache'     => 'required|integer|min:5|max:120',
        ]);

        foreach ($validated as $key => $value) {
            settings()->put($key, $value);
        }
    }

    /**
     * Get gateway
     *
     * @return array
     */
    public function getGateway()
    {
        return settings()->gateway->all();
    }

    /**
     * Update gateway
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateGateway(Request $request)
    {
        $validated = $this->validate($request, [
            'paypal' => 'required|boolean'
        ]);

        foreach ($validated as $key => $value) {
            settings()->gateway->put($key, $value);
        }
    }
}
