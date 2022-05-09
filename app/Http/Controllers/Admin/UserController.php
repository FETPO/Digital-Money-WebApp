<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:view_users');
    }

    /**
     * Paginate users
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function paginate()
    {
        return UserResource::collection(paginate(User::latest()));
    }

    /**
     * Deactivate user
     *
     * @param Request $request
     * @param User $user
     * @throws \Illuminate\Validation\ValidationException
     */
    public function deactivate(Request $request, User $user)
    {
        if (!Auth::user()->canUpdateUser($user)) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $validated = $this->validate($request, [
            'date' => 'required|date|after:now'
        ]);

        $user->update(['deactivated_until' => $validated['date']]);
    }

    /**
     * Activate user
     *
     * @param User $user
     * @throws \Illuminate\Validation\ValidationException
     */
    public function activate(User $user)
    {
        if (!Auth::user()->canUpdateUser($user)) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $user->update(['deactivated_until' => null]);
    }

    /**
     * Batch deactivate
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function batchDeactivate(Request $request)
    {
        if (!Auth::user()->can("update_users")) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $validated = $this->validate($request, [
            'date'    => 'required|date|after:now',
            'users'   => 'required|array',
            'users.*' => 'required|exists:users,id'
        ]);

        Auth::user()->subordinates()->whereIn('id', $validated['users'])
            ->update(['deactivated_until' => $validated['date']]);
    }

    /**
     * Batch activate
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function batchActivate(Request $request)
    {
        if (!Auth::user()->can("update_users")) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $validated = $this->validate($request, [
            'users'   => 'required|array',
            'users.*' => 'required|exists:users,id'
        ]);

        Auth::user()->subordinates()->whereIn('id', $validated['users'])
            ->update(['deactivated_until' => null]);
    }
}
