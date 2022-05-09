<?php

namespace App\Providers;

use App\Events\UserActivities\EmailChanged;
use App\Events\UserActivities\EnabledTwoFactor;
use App\Events\UserActivities\LoggedIn;
use App\Events\UserActivities\PasswordChanged;
use App\Events\UserActivities\PasswordReset;
use App\Events\UserActivities\PhoneChanged;
use App\Events\UserActivities\UpdatedPicture;
use App\Events\UserActivities\UpdatedPreference;
use App\Events\UserActivities\UpdatedProfile;
use App\Events\UserActivities\VerifiedEmail;
use App\Events\UserActivities\VerifiedPhone;
use App\Listeners\LogUserActivity;
use App\Listeners\NotifyUserActivity;
use App\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class        => [SendEmailVerificationNotification::class],
        EnabledTwoFactor::class  => [LogUserActivity::class, NotifyUserActivity::class],
        LoggedIn::class          => [LogUserActivity::class, NotifyUserActivity::class],
        PasswordReset::class     => [LogUserActivity::class, NotifyUserActivity::class],
        PasswordChanged::class   => [LogUserActivity::class, NotifyUserActivity::class],
        EmailChanged::class      => [LogUserActivity::class, NotifyUserActivity::class],
        PhoneChanged::class      => [LogUserActivity::class, NotifyUserActivity::class],
        UpdatedPicture::class    => [LogUserActivity::class],
        UpdatedPreference::class => [LogUserActivity::class],
        UpdatedProfile::class    => [LogUserActivity::class],
        VerifiedEmail::class     => [LogUserActivity::class],
        VerifiedPhone::class     => [LogUserActivity::class]
    ];
}
