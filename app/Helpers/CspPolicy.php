<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Spatie\Csp\Directive;
use Spatie\Csp\Exceptions\InvalidDirective;
use Spatie\Csp\Exceptions\InvalidValueSet;
use Spatie\Csp\Keyword;
use Spatie\Csp\Policies\Policy;
use Symfony\Component\HttpFoundation\Response;

class CspPolicy extends Policy
{
    /**
     * Disable CSP for client error.
     *
     * @param Request $request
     * @param Response $response
     * @return bool
     */
    public function shouldBeApplied(Request $request, Response $response): bool
    {
        if (!config('app.debug') || !($response->isClientError() || $response->isServerError())) {
            return parent::shouldBeApplied($request, $response);
        } else {
            return false;
        }
    }

    /**
     * @throws InvalidDirective
     * @throws InvalidValueSet
     */
    public function configure()
    {
        $whitelisted = $this->whitelisted();

        $this
            ->addDirective(Directive::DEFAULT, [
                Keyword::SELF, ...$whitelisted
            ])
            ->addDirective(Directive::SCRIPT, [
                Keyword::SELF, ...$whitelisted,
                Keyword::REPORT_SAMPLE,
                "hcaptcha.com",
                "newassets.hcaptcha.com",
                "polyfill.io",
            ])
            ->addDirective(Directive::STYLE, [
                Keyword::SELF, ...$whitelisted,
                Keyword::UNSAFE_INLINE,
                "fonts.googleapis.com"
            ])
            ->addDirective(Directive::BASE, [
                Keyword::SELF, ...$whitelisted
            ])
            ->addDirective(Directive::CONNECT, [
                Keyword::SELF, ...$whitelisted, "ws:", "wss:"
            ])
            ->addDirective(Directive::FONT, [
                Keyword::SELF, ...$whitelisted,
                "fonts.gstatic.com"
            ])
            ->addDirective(Directive::FRAME, [
                Keyword::SELF, ...$whitelisted,
                "hcaptcha.com",
                "newassets.hcaptcha.com"
            ])
            ->addDirective(Directive::IMG, [
                Keyword::SELF, ...$whitelisted, "data:"
            ])
            ->addDirective(Directive::OBJECT, Keyword::NONE)
            ->addNonceForDirective(Directive::SCRIPT);
    }

    /**
     * Get whitelisted patterns
     *
     * @return string[]
     */
    public function whitelisted()
    {
        $domain = parse_url(config('app.url'), PHP_URL_HOST) ?: 'localhost';

        return [
            "$domain", "www.$domain",
            "$domain:6001", "www.$domain:6001",
            "app.$domain:8080"
        ];
    }
}