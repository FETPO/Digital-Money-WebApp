<?php

namespace App\Http\Requests;

use App\Events\UserActivities\VerifiedEmail;
use Illuminate\Foundation\Auth\EmailVerificationRequest as VerificationRequest;

class EmailVerificationRequest extends VerificationRequest
{
    /**
     * Fulfill the email verification request.
     *
     * @return void
     */
    public function fulfill()
    {
        if (!$this->user()->hasVerifiedEmail()) {
            $this->user()->markEmailAsVerified();

            event(new VerifiedEmail($this->user()));
        }
    }
}
