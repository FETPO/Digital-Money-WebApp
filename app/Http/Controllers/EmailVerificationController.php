<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\EmailVerificationRequest;

class EmailVerificationController extends Controller
{
    /**
     * Send email
     *
     * @param Request $request
     */
    public function sendEmail(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();
    }

    /**
     * Verify email
     *
     * @param EmailVerificationRequest $request
     * @return mixed
     */
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return redirect()->route('index')->notify(trans('verification.email_verified'), "success");
    }
}
