<?php

namespace App\Events\UserActivities;

use App\Abstracts\UserActivityEvent;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class VerifiedPhone extends UserActivityEvent implements ShouldBroadcast
{
    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel("Auth.User.{$this->user->id}");
    }

    /**
     * User activity action
     *
     * @return string
     */
    protected function action(): string
    {
        return 'verified phone';
    }
}
