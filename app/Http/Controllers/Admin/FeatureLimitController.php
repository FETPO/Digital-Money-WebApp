<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeatureLimitResource;
use App\Models\FeatureLimit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class FeatureLimitController extends Controller
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
     * Get all feature limit
     *
     * @return AnonymousResourceCollection
     */
    public function get()
    {
        return FeatureLimitResource::collection(FeatureLimit::all());
    }

    /**
     * Update feature limit
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function update(Request $request)
    {
        $limits = FeatureLimit::all()->pluck('name');

        $validated = $this->validate($request, [
            'limits'                    => ['required', "array:{$limits->implode(",")}"],
            'limits.*'                  => ['required', 'array:unverified_limit,basic_limit,advanced_limit,period'],
            'limits.*.unverified_limit' => 'required|numeric|min:0|max:999999',
            'limits.*.basic_limit'      => 'required|numeric|min:0|max:999999',
            'limits.*.advanced_limit'   => 'required|numeric|min:0|max:999999',
            'limits.*.period'           => 'required|in:day,month,year',
        ]);

        foreach ($validated['limits'] as $name => $attributes) {
            FeatureLimit::findOrFail($name)->update($attributes);
        }
    }

    /**
     * Get all settings
     *
     * @return array
     */
    public function getSettings()
    {
        return settings()->verification->all();
    }

    /**
     * Update settings
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateSettings(Request $request)
    {
        $validated = $this->validate($request, [
            'verified_phone'     => 'required|boolean',
            'verified_email'     => 'required|boolean',
            'complete_profile'   => 'required|boolean',
            'verified_documents' => 'required|boolean',
            'verified_address'   => 'required|boolean',
        ]);

        foreach ($validated as $key => $value) {
            settings()->verification->put($key, $value);
        }
    }
}
