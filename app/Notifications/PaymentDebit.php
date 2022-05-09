<?php

namespace App\Notifications;

use App\Models\PaymentTransaction;
use App\Notifications\Traits\Notifier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PaymentDebit extends Notification implements ShouldQueue
{
    use Queueable, Notifier;

    /**
     * Payment transaction
     *
     * @var PaymentTransaction
     */
    protected $transaction;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(PaymentTransaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Replacement parameters and Values
     *
     * @param $notifiable
     * @return array
     */
    protected function parameters($notifiable)
    {
        return [
            'value'           => $this->transaction->value,
            'formatted_value' => $this->transaction->formatted_value,
            'currency'        => $this->transaction->account->currency,
            'description'     => $this->transaction->description,
        ];
    }
}
