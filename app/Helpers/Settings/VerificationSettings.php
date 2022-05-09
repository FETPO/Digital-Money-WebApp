<?php

namespace App\Helpers\Settings;

use App\Helpers\InteractsWithStore;

class VerificationSettings
{
    use InteractsWithStore;

    /**
     * Initialize attributes with default value
     *
     * @var array
     */
    protected array $attributes = [
        'verified_phone'     => true,
        'verified_email'     => true,
        'complete_profile'   => true,
        'verified_documents' => true,
        'verified_address'   => true,
    ];
}