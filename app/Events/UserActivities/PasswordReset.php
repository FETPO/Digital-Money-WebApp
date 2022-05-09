<?php

namespace App\Events\UserActivities;

use App\Abstracts\UserActivityEvent;

class PasswordReset extends UserActivityEvent
{
    /**
     * User activity action
     *
     * @return string
     */
    protected function action(): string
    {
        return 'password reset';
    }
}
