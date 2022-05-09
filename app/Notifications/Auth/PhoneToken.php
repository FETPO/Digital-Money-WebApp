<?php

namespace App\Notifications\Auth;

use App\Models\User;
use App\Notifications\Traits\Notifier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PhoneToken extends Notification implements ShouldQueue
{
    use Queueable, Notifier;

    /**
     * Get the notification's channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [getSmsChannel()];
    }

    /**
     * Replacement Parameters and Values
     *
     * @param User $notifiable
     * @return array
     */
    protected function parameters($notifiable)
    {
        $token = $notifiable->generatePhoneToken();

        return [
            'code'      => $token['token'],
            'minutes'   => $token['duration'],
        ];
    }
}
