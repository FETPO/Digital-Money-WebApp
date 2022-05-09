<?php
/**
 * ======================================================================================================
 * File Name: TwoFactor.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 11/30/2020 (2:27 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\Models\Traits;


use App\Helpers\TwoFactorAuth;
use Exception;
use PragmaRX\Google2FA\Google2FA;

trait TwoFactor
{
    /**
     * Determine if the user has enabled two factor
     *
     * @return bool
     */
    public function enabledTwoFactor()
    {
        return $this->two_factor_enable;
    }

    /**
     * Reset two factor
     *
     * @return void
     */
    public function resetTwoFactorToken()
    {
        if (!$this->enabledTwoFactor()) {
            $this->two_factor_secret = app(TwoFactorAuth::class)->generateSecretKey();
            $this->save();
        }
    }

    /**
     * Decrypt two factor secret
     *
     * @param $value
     * @return mixed
     */
    public function getTwoFactorSecretAttribute($value)
    {
        return decrypt($value);
    }

    /**
     * Encrypt two factor secret
     *
     * @param $value
     */
    public function setTwoFactorSecretAttribute($value)
    {
        $this->attributes['two_factor_secret'] = encrypt($value);
    }

    /**
     * Verify two factor token
     *
     * @param $token
     * @return bool|int
     */
    public function verifyTwoFactorToken($token)
    {
        return resolve(Google2FA::class)->verifyKey($this->two_factor_secret, $token);
    }

    /**
     * Get the two factor authentication QR code URL.
     *
     * @return string
     */
    public function getTwoFactorQrCodeUrl()
    {
        return app(TwoFactorAuth::class)->qrCodeUrl(
            config('app.name'),
            $this->email,
            $this->two_factor_secret
        );
    }
}
