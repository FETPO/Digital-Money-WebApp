<?php

namespace App\Http\Controllers;

use App\Helpers\LocaleManager;
use App\Helpers\Settings;
use App\Http\Resources\UserResource;
use ArrayObject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    /**
     * @var LocaleManager
     */
    protected $localeManager;

    /**
     * IndexController constructor.
     *
     * @param LocaleManager $localeManager
     */
    public function __construct(LocaleManager $localeManager)
    {
        $this->localeManager = $localeManager;
    }

    /**
     * Where it all begins!
     *
     * @param Request $request
     * @param Settings $settings
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function view(Settings $settings)
    {
        $data = [
            'name'      => config('app.name'),
            'broadcast' => $this->getBroadcastConfig(),
            'settings'  => [
                'recaptcha'        => [
                    'enable'  => config('services.recaptcha.enable'),
                    'sitekey' => config('services.recaptcha.sitekey'),
                    'size'    => config('services.recaptcha.size'),
                ],
                'supportedLocales' => $this->getSupportedLocales(),
                'exchange'         => [
                    'baseCurrency' => app('exchanger')->config('base_currency')
                ],
                'theme'            => [
                    "mode"      => $settings->theme->get("mode"),
                    "direction" => $settings->theme->get("direction"),
                    "color"     => $settings->theme->get("color"),
                ],
                'brand'            => [
                    "faviconUrl" => $settings->brand->get("favicon_url"),
                    "logoUrl"    => $settings->brand->get("logo_url"),
                    "supportUrl" => $settings->brand->get("support_url"),
                    "termsUrl"   => $settings->brand->get("terms_url"),
                    "policyUrl"  => $settings->brand->get("policy_url"),
                ]
            ],
            'auth'      => [
                'credential' => config('auth.credential'),
                'user'       => $this->getAuthUser(),
                'userSetup'  => $settings->get('user_setup'),
            ],
            'csrfToken' => csrf_token(),
        ];

        if ($notification = session('notification')) {
            $data = array_merge($data, compact('notification'));
        }

        return view('index', compact('data', 'settings'));
    }

    /**
     * Get user object
     *
     * @return UserResource
     */
    protected function getAuthUser()
    {
        optional(Auth::user())->updatePresence("online");
        return UserResource::make(Auth::user());
    }

    /**
     * Get supported locales object
     *
     * @return ArrayObject
     */
    protected function getSupportedLocales()
    {
        return new ArrayObject($this->localeManager->getSupportedLocalesDetails());
    }

    /**
     * Get event broadcasting config
     *
     * @return array
     */
    protected function getBroadcastConfig()
    {
        $connection = new ArrayObject();
        $driver = config('broadcasting.default');

        if ($driver == 'pusher') {
            $pusher = config("broadcasting.connections")[$driver];
            $connection['key'] = $pusher['key'];
            $options = $pusher['options'];
            $connection['cluster'] = $options['cluster'];
            $connection['port'] = $options['port'];
        }

        return compact('connection', 'driver');
    }

    /**
     * Get IP Info
     *
     * @param Request $request
     * @return array
     */
    public function ipInfo(Request $request)
    {
        return geoip($request->ip())->toArray();
    }
}
