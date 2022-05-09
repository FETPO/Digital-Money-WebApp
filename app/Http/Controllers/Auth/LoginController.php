<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserActivities\LoggedIn;
use App\Http\Controllers\Controller;
use App\Http\Requests\RecaptchaRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Foundation\Auth\RedirectsUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use RedirectsUsers, ThrottlesLogins;

    protected $decayMinutes = 60;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Handle a login request to the application.
     *
     * @param RecaptchaRequest $request
     * @return JsonResponse|RedirectResponse|void
     *
     * @throws ValidationException
     */
    public function login(RecaptchaRequest $request)
    {
        $this->validateLogin($request);

        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        if ($this->attemptLogin($request)) {
            return $this->sendLoginResponse($request);
        }

        $this->incrementLoginAttempts($request);

        return $this->sendFailedLoginResponse($request);
    }

    /**
     * Validate the user login request.
     *
     * @param RecaptchaRequest $request
     * @return void
     *
     * @throws ValidationException
     */
    protected function validateLogin(Request $request)
    {
        $request->validate([
            $this->username() => 'required|string',
            'password'        => 'required|string',
        ]);
    }

    /**
     * Attempt to log the user into the application.
     *
     * @param Request $request
     * @return bool
     * @throws ValidationException
     */
    protected function attemptLogin(Request $request)
    {
        if ($user = $this->getUser($request)) {
            if ($user->enabledTwoFactor()) {
                $request->validate([
                    'token' => [
                        'required', function ($attribute, $value, $fail) use ($user) {
                            if (!$user->verifyTwoFactorToken($value)) {
                                $fail(trans('auth.invalid_token'));
                            }
                        },
                    ],
                ]);
            }

            if ($user->deactivated()) {
                throw ValidationException::withMessages([
                    $this->username() => [
                        trans('auth.deactivated', [
                            'date' => $user->deactivated_until->toFormattedDateString()
                        ])
                    ],
                ]);
            }
        }

        return $this->guard()->attempt(
            $this->credentials($request), (bool) $request->get('remember')
        );
    }

    /**
     * Get user from request
     *
     * @param Request $request
     * @return User
     */
    protected function getUser(Request $request)
    {
        return User::where($this->username(), $request->get($this->username()))->first();
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param Request $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        return $request->only($this->username(), 'password');
    }

    /**
     * Send the response after the user was authenticated.
     *
     * @param Request $request
     * @return RedirectResponse|JsonResponse
     */
    protected function sendLoginResponse(Request $request)
    {
        $this->clearLoginAttempts($request);
        $request->session()->regenerate();

        $user = $this->guard()->user();
        $user->update(['last_login_at' => now()]);

        event(new LoggedIn($user));

        $url = session()->pull('url.intended');

        return !$request->wantsJson()
            ? redirect()->to($url ?: $this->redirectPath())
            : response()->json(['intended' => $url]);
    }

    /**
     * Get the failed login response instance.
     *
     * @param Request $request
     * @return void
     *
     * @throws ValidationException
     */
    protected function sendFailedLoginResponse(Request $request)
    {
        throw ValidationException::withMessages([
            $this->username() => [trans('auth.failed')],
        ]);
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    protected function username()
    {
        return config('auth.credential', 'email');
    }

    /**
     * Log the user out of the application.
     *
     * @param Request $request
     * @return RedirectResponse|JsonResponse
     */
    public function logout(Request $request)
    {
        $this->guard()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return !$request->wantsJson()
            ? redirect()->to($this->redirectPath())
            : response()->json([], 204);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return StatefulGuard
     */
    protected function guard()
    {
        return Auth::guard();
    }
}
