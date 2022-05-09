<?php


namespace App\Helpers;


use Illuminate\Support\Facades\Cache;

class Token
{
    /**
     * Get token key
     *
     * @param string $identifier
     * @return string
     */
    private function getKey(string $identifier)
    {
        return "token:$identifier";
    }

    /**
     * @param string $identifier
     * @param string $token
     * @return bool
     */
    public function validate(string $identifier, string $token): bool
    {
        return Cache::get($this->getKey($identifier)) === $token;
    }

    /**
     * Generate token
     *
     * @param string $identifier
     * @param int $digits
     * @param int $minutes
     * @return array
     */
    public function generate(string $identifier, int $digits = 6, int $minutes = 1): array
    {
        $expiresAt = now()->addMinutes($minutes);

        $key = $this->getKey($identifier);

        $token = Cache::get($key, $this->generateToken($digits));

        if (!Cache::has($key)) {
            Cache::put($key, $token, $expiresAt);
        }

        return [
            "token"      => $token,
            "expires_at" => $expiresAt,
            "duration"   => $minutes,
        ];
    }

    /**
     * Generate token
     *
     * @param int $digits
     * @return string
     */
    private function generateToken(int $digits = 6)
    {
        $pin = "";

        for ($i = 0; $i < $digits; $i++) {
            $pin .= mt_rand(0, 9);
        }

        return $pin;
    }
}