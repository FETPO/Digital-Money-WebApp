<?php

namespace App\Events\UserActivities;

use App\Abstracts\UserActivityEvent;

class EmailChanged extends UserActivityEvent
{
    /**
     * User activity action
     *
     * @return string
     */
    protected function action(): string
    {
        return 'email changed';
    }
}
