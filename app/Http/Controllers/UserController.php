<?php

namespace App\Http\Controllers;

use App\Events\UserActivities\EnabledTwoFactor;
use App\Events\UserActivities\PasswordChanged;
use App\Events\UserActivities\UpdatedPicture;
use App\Events\UserActivities\UpdatedPreference;
use App\Events\UserActivities\UpdatedProfile;
use App\Events\UserActivities\VerifiedEmail;
use App\Events\UserActivities\VerifiedPhone;
use App\Http\Resources\UserActivityResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Rules\ProtectField;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Get user data
     *
     * @return \App\Http\Resources\UserResource
     */
    public function data()
    {
        return UserResource::make(Auth::user());
    }

    /**
     * Get notification settings
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getNotificationSettings()
    {
        return Auth::user()->getNotificationSettings();
    }

    /**
     * Update notification settings
     *
     * @param Request $request
     * @param $name
     * @return void
     * @throws ValidationException
     */
    public function updateNotificationSettings(Request $request)
    {
        $validated = $this->validate($request, [
            'notification' => 'required|array'
        ]);

        $records = Auth::user()->notificationSetting;
        $data = Arr::get($validated, 'notification');
        $settings = config('notifications.settings');

        foreach ($records as $saved) {
            if (isset($settings[$saved->name])) {

                foreach ($settings[$saved->name] as $channel => $status) {
                    if (!is_null($status)) {
                        $saved->fill([
                            $channel => !empty($data[$saved->name][$channel])
                        ]);
                    }
                }

                $saved->save();
            }
        }

        event(new UpdatedPreference(Auth::user()));
    }

    /**
     * Paginate user activites
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function activityPaginate()
    {
        $activities = paginate(Auth::user()->activities()->latest());

        return UserActivityResource::collection($activities);
    }

    /**
     * Get two factor secret
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    public function getTwoFactor(Request $request)
    {
        if (Auth::user()->enabledTwoFactor()) {
            $this->validate($request, [
                'token' => [
                    'required', function ($attribute, $value, $fail) {
                        if (!Auth::user()->verifyTwoFactorToken($value)) {
                            $fail(trans('two-factor.invalid_token'));
                        }
                    },
                ],
            ]);
        }

        return [
            'url'    => Auth::user()->getTwoFactorQrCodeUrl(),
            'secret' => Auth::user()->two_factor_secret
        ];
    }

    /**
     * Reset two factor secret
     *
     * @return array|void
     */
    public function resetTwoFactorToken()
    {
        return Auth::user()->acquireLock(function ($user) {
            if ($user->enabledTwoFactor()) {
                abort(403, trans("two-factor.enabled"));
            }

            $user->resetTwoFactorToken();

            return [
                'url'    => $user->getTwoFactorQrCodeUrl(),
                'secret' => $user->two_factor_secret
            ];
        });
    }

    /**
     * Enable two factor
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function setTwoFactor(Request $request)
    {
        $this->validate($request, [
            'token' => [
                'required', function ($attribute, $value, $fail) {
                    if (!Auth::user()->verifyTwoFactorToken($value)) {
                        $fail(trans('two-factor.invalid_token'));
                    }
                },
            ],
        ]);

        Auth::user()->update(['two_factor_enable' => true]);

        event(new EnabledTwoFactor(Auth::user()));
    }

    /**
     * Update profile
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function update(Request $request)
    {
        Auth::user()->acquireLock(function (User $user) use ($request) {
            $profile = $user->profile()->firstOrNew();

            $userInput = $this->validate($request, [
                'email'    => ['email:rfc,dns,spoof', 'max:255', $this->uniqueRule($user)],
                'phone'    => [Rule::phone()->detect(), $this->uniqueRule($user)],
                'country'  => [Rule::in($this->getCountryCodes()), new ProtectField($user->country)],
                'currency' => ['exists:supported_currencies,code'],
            ]);

            $profileInput = $this->validate($request, [
                'last_name'  => ['string', 'max:100', new ProtectField($profile->last_name)],
                'first_name' => ['string', 'max:100', new ProtectField($profile->first_name)],
                'dob'        => ['date', 'before:-18 years'],
                'bio'        => ['nullable', 'string', 'max:1000'],
            ]);

            $user->fill($userInput)->save();
            $profile->fill($profileInput)->save();
            event(new UpdatedProfile($user));
        });
    }

    /**
     * Get country codes
     *
     * @return \Illuminate\Support\Collection
     */
    protected function getCountryCodes()
    {
        return collect(config('countries'))->keys();
    }

    /**
     * Get unique rule
     *
     * @return \Illuminate\Validation\Rules\Unique
     */
    protected function uniqueRule(User $user)
    {
        return Rule::unique('users')->ignore($user);
    }

    /**
     * Verify phone with token
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function verifyPhoneWithToken(Request $request)
    {
        if (Auth::user()->isPhoneVerified()) {
            abort(403, trans('verification.phone_already_verified'));
        }

        $validated = $this->validate($request, [
            'token' => 'required|string|min:6'
        ]);

        if (Auth::user()->validatePhoneToken($validated['token'])) {
            Auth::user()->update(['phone_verified_at' => now()]);
        } else {
            abort(422, trans('verification.invalid_phone_token'));
        }

        event(new VerifiedPhone(Auth::user()));
    }

    /**
     * Verify email with token
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function verifyEmailWithToken(Request $request)
    {
        if (Auth::user()->isEmailVerified()) {
            abort(403, trans('verification.email_already_verified'));
        }

        $validated = $this->validate($request, [
            'token' => 'required|string|min:6'
        ]);

        if (Auth::user()->validateEmailToken($validated['token'])) {
            Auth::user()->update(['email_verified_at' => now()]);
        } else {
            abort(422, trans('verification.invalid_email_token'));
        }

        event(new VerifiedEmail(Auth::user()));
    }

    /**
     * Upload Picture
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function uploadPicture(Request $request)
    {
        $this->validate($request, [
            'file' => 'required|mimetypes:image/png,image/jpeg|dimensions:ratio=1|file|max:100'
        ]);

        $file = $request->file('file');
        $picture = savePublicFile($file, Auth::user()->path(), "avatar.{$file->extension()}");

        Auth::user()->profile->update(['picture' => $picture]);
        event(new UpdatedPicture(Auth::user()));
    }

    /**
     * Change user password
     *
     * @param Request $request
     * @throws ValidationException|AuthenticationException
     */
    public function changePassword(Request $request)
    {
        $this->validate($request, [
            'old_password' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!Hash::check($value, Auth::user()->password)) {
                        $fail(trans('auth.invalid_password'));
                    }
                },
            ],

            'password' => [
                'required', 'string', 'min:8', 'confirmed',
                'different:old_password', Password::defaults()
            ]
        ]);

        $password = $request->get('password');

        Auth::user()->update(['password' => Hash::make($password)]);

        event(new PasswordChanged(Auth::user()));

        Auth::logoutOtherDevices($password);
    }

    /**
     * Update presence as online
     */
    public function setOnline()
    {
        Auth::user()->updatePresence("online");
    }

    /**
     * Update presence as away
     */
    public function setAway()
    {
        Auth::user()->updatePresence("away");
    }

    /**
     * Update presence as offline
     */
    public function setOffline()
    {
        Auth::user()->updatePresence("offline");
    }
}
