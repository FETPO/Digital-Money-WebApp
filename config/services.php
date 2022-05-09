<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'bitgo' => [
        'env' => env('BITGO_ENV', 'test'),
        'token' => env('BITGO_TOKEN'),
        'host' => env('BITGO_HOST'),
        'port' => env('BITGO_PORT'),
        'fee_percent' => env('BITGO_FEE_PERCENT', 0.0025),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'nexmo' => [
        'key' => env('NEXMO_KEY'),
        'secret' => env('NEXMO_SECRET'),
        'sms_from' => env('NEXMO_PHONE'),
    ],

    'sns' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'africastalking' => [
        'username'      => env('AT_USERNAME'),
        'key'           => env('AT_KEY'),
        'from'          => env('AT_FROM'),
    ],

    'cryptocompare' => [
        'key' => env('CRYPTOCOMPARE_KEY'),
    ],

    'recaptcha' => [
        'enable' => env('RECAPTCHA_ENABLE', false),
        'secret' => env('RECAPTCHA_SECRET', 'secret'),
        'sitekey' => env('RECAPTCHA_SITEKEY', 'sitekey'),
        'size' => env('RECAPTCHA_SIZE', 'normal')
    ]
];
