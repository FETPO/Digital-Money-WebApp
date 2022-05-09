<?php

namespace App\Console\Commands;

use App\Helpers\DumperFactory;
use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Str;
use Spatie\DbDumper\DbDumper;

class DatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup database';

    /**
     * Extension
     *
     * @var string
     */
    protected string $extension = ".sql.backup.";

    /**
     * Filesystem
     *
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->filesystem = app('filesystem')->disk('backup');
    }

    /**
     * Execute the console command.
     *
     * @return int|void
     */
    public function handle()
    {
        $connection = config('database.default');
        $dumper = DumperFactory::createFromConnection($connection);

        $this->cleanOldBackups();

        $dumper->dumpToFile($this->filepath($dumper));
        $this->info("Dumped database: {$dumper->getDbName()}");
    }

    /**
     * Remove old backups
     *
     * @return void
     */
    protected function cleanOldBackups()
    {
        collect($this->filesystem->listContents())
            ->each(function($file) {
                if (Str::contains($file['basename'], $this->extension)){
                    $timestamp = now()->subWeek()->getTimestamp();

                    if ($file['type'] == 'file' && $file['timestamp'] < $timestamp) {
                        $this->filesystem->delete($file['path']);
                    }
                }
            });
    }

    /**
     * Get file path
     *
     * @param DbDumper $dumper
     * @return string
     */
    protected function filepath(DbDumper $dumper)
    {
        $name = $dumper->getDbName() . $this->extension . now()->getTimestamp();
        return $this->filesystem->path($name);
    }
}
