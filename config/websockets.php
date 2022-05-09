<?php


return [

    /*
     * Set a custom dashboard configuration
     */
    'dashboard' => [
        'port' => 6001,
    ],

    /*
     * This package comes with multi tenancy out of the box. Here you can
     * configure the different apps that can use the webSockets server.
     *
     * Optionally you specify capacity so you can limit the maximum
     * concurrent connections for a specific app.
     *
     * Optionally you can disable client events so clients cannot send
     * messages to each other via the webSockets.
     */
    'apps' => [
        [
            'id' => env('PUSHER_APP_ID'),
            'name' => env('APP_NAME'),
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'path' => env('PUSHER_APP_PATH'),
            'capacity' => null,
            'enable_client_messages' => false,
            'enable_statistics' => true,
        ],
    ],

    /*
     * This class is responsible for finding the apps. The default provider
     * will use the apps defined in this config file.
     *
     * You can create a custom provider by implementing the
     * `AppProvider` interface.
     */
    'app_provider' => BeyondCode\LaravelWebSockets\Apps\ConfigAppProvider::class,

    /*
     * This array contains the hosts of which you want to allow incoming requests.
     * Leave this empty if you want to accept requests from all hosts.
     */
    'allowed_origins' => [
        parse_url(env('APP_URL'), PHP_URL_HOST) ?: 'localhost',
    ],

    /*
     * The maximum request size in kilobytes that is allowed for an incoming WebSocket request.
     */
    'max_request_size_in_kb' => 250,

    /*
     * This path will be used to register the necessary routes for the package.
     */
    'path' => 'websockets',

    /*
     * Dashboard Routes Middleware
     *
     * These middleware will be assigned to every dashboard route, giving you
     * the chance to add your own middleware to this list or change any of
     * the existing middleware. Or, you can simply stick with this list.
     */
    'middleware' => [
        'web', 'role:Super Admin'
    ],

    'statistics' => [
        /*
         * This model will be used to store the statistics of the WebSocketsServer.
         * The only requirement is that the model should extend
         * `WebSocketsStatisticsEntry` provided by this package.
         */
        'model' => \BeyondCode\LaravelWebSockets\Statistics\Models\WebSocketsStatisticsEntry::class,

        /**
         * The Statistics Logger will, by default, handle the incoming statistics, store them
         * and then release them into the database on each interval defined below.
         */
        'logger' => \BeyondCode\LaravelWebSockets\Statistics\Logger\HttpStatisticsLogger::class,

        /*
         * Here you can specify the interval in seconds at which statistics should be logged.
         */
        'interval_in_seconds' => 60,

        /*
         * When the clean-command is executed, all recorded statistics older than
         * the number of days specified here will be deleted.
         */
        'delete_statistics_older_than_days' => 60,

        /*
         * Use an DNS resolver to make the requests to the statistics logger
         * default is to resolve everything to 127.0.0.1.
         */
        'perform_dns_lookup' => false,
    ],

    /*
     * Channel Manager
     * This class handles how channel persistence is handled.
     * By default, persistence is stored in an array by the running webserver.
     * The only requirement is that the class should implement
     * `ChannelManager` interface provided by this package.
     */
    'channel_manager' => \BeyondCode\LaravelWebSockets\WebSockets\Channels\ChannelManagers\ArrayChannelManager::class,
];
