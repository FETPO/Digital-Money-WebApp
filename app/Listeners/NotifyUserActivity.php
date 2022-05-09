<?php

namespace App\Listeners;

use App\Abstracts\UserActivityEvent;
use App\Notifications\Auth\UserActivity;

class NotifyUserActivity
{
    /**
     * Handle the event.
     *
     * @param UserActivityEvent $event
     * @return void
     */
    public function handle(UserActivityEvent $event)
    {
        $event->getUser()->notify(new UserActivity(
            $event->action,
            $event->ip,
            $event->source,
            $event->agent
        ));
    }
}
