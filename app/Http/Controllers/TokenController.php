<?php

namespace App\Http\Controllers;

use App\Helpers\Token;
use App\Notifications\Auth\EmailToken;
use App\Notifications\Auth\PhoneToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokenController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('throttle:5,300');
    }

    /**
     * Send phone token
     *
     * @return void
     */
    public function sendPhone()
    {
        Auth::user()->notify(new PhoneToken());
    }

    /**
     * Send email token
     *
     * @return void
     */
    public function sendEmail()
    {
        Auth::user()->notify(new EmailToken());
    }
}
