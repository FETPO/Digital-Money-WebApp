<?php

namespace App\Helpers\Settings;

use App\Helpers\InteractsWithStore;

class ThemeSettings
{
    use InteractsWithStore;

    /**
     * Initialize attributes with default value
     *
     * @var array
     */
    protected array $attributes = [
        'mode'      => "dark",
        'direction' => "ltr",
        'color'     => "orange",
    ];
}