<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateUsersPresence extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-presence';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set users which last seen is a long time ago to offline';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $lifetime = config('session.lifetime');

        User::whereIn('presence', ['online', 'away'])->get()
            ->each(function (User $user) use ($lifetime) {
                if (!$user->last_seen_at || now()->diffInMinutes($user->last_seen_at) > $lifetime) {
                    $user->updatePresence('offline');
                }
            });
    }
}
