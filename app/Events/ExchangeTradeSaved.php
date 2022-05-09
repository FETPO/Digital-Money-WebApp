<?php

namespace App\Events;

use App\Models\ExchangeTrade;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExchangeTradeSaved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var ExchangeTrade
     */
    protected $exchangeTrade;

    /**
     * Create a new event instance.
     *
     * @param ExchangeTrade $exchangeTrade
     * @return void
     */
    public function __construct(ExchangeTrade $exchangeTrade)
    {
        $this->exchangeTrade = $exchangeTrade;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel("Auth.User.{$this->exchangeTrade->walletAccount->user->id}");
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'status'       => $this->exchangeTrade->status,
            'completed_at' => $this->exchangeTrade->completed_at,
        ];
    }
}
