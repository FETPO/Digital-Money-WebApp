<?php

namespace App\Notifications;

use App\Models\TransferRecord;
use App\Notifications\Traits\Notifier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class WalletDebit extends Notification implements ShouldQueue
{
    use Queueable, Notifier;

    /**
     * @var TransferRecord
     */
    protected $transferRecord;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(TransferRecord $transferRecord)
    {
        $this->transferRecord = $transferRecord;
    }

    /**
     * Replacement Parameters and Values
     *
     * @param $notifiable
     * @return array
     */
    protected function parameters($notifiable)
    {
        return [
            'coin'                  => $this->transferRecord->coin->name,
            'value'                 => $this->transferRecord->value,
            'value_price'           => $this->transferRecord->value_price,
            'formatted_value_price' => $this->transferRecord->formatted_value_price,
            'description'           => $this->transferRecord->description,
        ];
    }
}
