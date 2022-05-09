<?php

namespace App\Events;

use App\Models\WalletAccount;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WalletAccountSaved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var WalletAccount
     */
    protected $walletAccount;

    /**
     * Create a new event instance.
     *
     * @param WalletAccount $walletAccount
     */
    public function __construct(WalletAccount $walletAccount)
    {
        $this->walletAccount = $walletAccount;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel("Auth.User.{$this->walletAccount->user->id}");
    }
}
