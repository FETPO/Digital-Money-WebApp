<?php

namespace App\Events;

use App\Models\TransferRecord;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransferRecordSaved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var TransferRecord
     */
    protected $transferRecord;

    /**
     * Create a new event instance.
     *
     * @param TransferRecord $transferRecord
     */
    public function __construct(TransferRecord $transferRecord)
    {
        $this->transferRecord = $transferRecord;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel("Auth.User.{$this->transferRecord->walletAccount->user->id}");
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'confirmed' => $this->transferRecord->confirmed
        ];
    }
}
