<?php
/**
 * ======================================================================================================
 * File Name: Settings.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 12/4/2020 (2:42 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\Helpers;

use App\Helpers\Settings\BrandSettings;
use App\Helpers\Settings\GatewaySettings;
use App\Helpers\Settings\ThemeSettings;
use App\Helpers\Settings\VerificationSettings;

/**
 * @property GatewaySettings $gateway
 * @property BrandSettings $brand
 * @property VerificationSettings $verification
 * @property ThemeSettings $theme
 */
class Settings
{
    use InteractsWithStore;

    /**
     * Initialize attributes with default value
     *
     * @var array
     */
    protected array $attributes = [
        'user_setup'      => true,
        'enable_mail'     => false,
        'enable_database' => true,
        'enable_sms'      => false,
        'min_payment'     => 50,
        'max_payment'     => 1000,
        'price_cache'     => 60,
    ];

    /**
     * Define settings' children
     *
     * @var array|string[]
     */
    protected array $children = [
        'gateway'      => GatewaySettings::class,
        'brand'        => BrandSettings::class,
        'verification' => VerificationSettings::class,
        'theme'        => ThemeSettings::class
    ];
}
