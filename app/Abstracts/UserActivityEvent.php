<?php

namespace App\Abstracts;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

abstract class UserActivityEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The authenticated user.
     *
     * @var User
     */
    protected $user;

    /**
     * User ip.
     *
     * @var string
     */
    public $ip;

    /**
     * User agent.
     *
     * @var string
     */
    public $agent;

    /**
     * User source of action: web or api
     *
     * @var string
     */
    public $source;

    /**
     * User activity action
     *
     * @var string
     */
    public $action;

    /**
     * Create a new event instance.
     *
     * @param $user
     */
    public function __construct(User $user)
    {
        $this->ip = $this->ip();
        $this->source = $this->source();
        $this->agent = $this->agent();
        $this->action = $this->action();
        $this->user = $user;
    }

    /**
     * Get user's Ip Address
     *
     * @return string|null
     */
    protected function ip()
    {
        return request()->ip();
    }

    /**
     * Get source of user event
     *
     * @return string|null
     */
    protected function source()
    {
        if (auth()->guard('web')->check()) {
            return 'web';
        }
        if (auth()->guard('api')->check()) {
            return 'api';
        }
        return null;
    }

    /**
     * Get user
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Get user agent
     *
     * @return array|string|null
     */
    protected function agent()
    {
        return request()->header('user-agent');
    }

    /**
     * Get user activity action
     *
     * @return string
     */
    abstract protected function action() : string;
}
