<?php

namespace App\Events\UserActivities;

use App\Abstracts\UserActivityEvent;

class LoggedIn extends UserActivityEvent
{
    /**
     * User activity action
     *
     * @return string
     */
    protected function action(): string
    {
        return 'logged in';
    }
}
