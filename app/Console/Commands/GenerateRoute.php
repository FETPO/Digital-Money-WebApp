<?php

namespace App\Console\Commands;

use App\Helpers\RouteGenerator\RouteGenerator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateRoute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ziggy:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a JavaScript file containing routes and configuration.';

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
        $content = $this->generate('main');
        File::put(resource_path('js/routeConfig.js'), $content);
        $this->line('Route file generated!');
    }

    /**
     * Generate Routes
     *
     * @param null $group
     * @return string
     */
    protected function generate($group = null)
    {
        $payload = (new RouteGenerator($group))->toJson();

        return <<<JAVASCRIPT
const routeConfig = {$payload};

export default routeConfig;
JAVASCRIPT;
    }
}
