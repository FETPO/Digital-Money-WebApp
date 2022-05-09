<?php

namespace App\Helpers\Settings;

use App\Helpers\InteractsWithStore;

class GatewaySettings
{
    use InteractsWithStore;

    /**
     * Initialize attributes with default value
     *
     * @var array
     */
    protected array $attributes = [
        'paypal' => true,
    ];
}