<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('exchanger:update')->daily()->withoutOverlapping();
        $schedule->command('geoip:update')->daily()->withoutOverlapping()->runInBackground();
        $schedule->command('transfer-records:update')->everyMinute()->runInBackground();
        $schedule->command('dispatch:pending-approval')->everyMinute()->runInBackground();
        $schedule->command('dispatch:pending-payment-transaction')->everyThirtyMinutes()->runInBackground();
        $schedule->command('dispatch:wallet-transaction')->everyMinute()->runInBackground();
        $schedule->command('users:update-presence')->everyMinute()->withoutOverlapping()->runInBackground();
        $schedule->command('statistics:update')->everyMinute()->withoutOverlapping()->runInBackground();
        $schedule->command('backup:database')->twiceDaily()->runInBackground();
        $schedule->command('schedule-timestamp:run')->everyMinute();
        $schedule->command('system-logs:clear')->daily();

        if ($this->app->environment('local')) {
            $schedule->command('telescope:prune')->daily();
        }
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
