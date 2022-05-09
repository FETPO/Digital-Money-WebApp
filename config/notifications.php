<?php

use NotificationChannels\AfricasTalking\AfricasTalkingChannel;
use NotificationChannels\AwsSns\SnsChannel;
use NotificationChannels\Twilio\TwilioChannel;

return [
    'defaults' => [
        'sms' => env('SMS_PROVIDER', 'nexmo')
    ],

    'drivers' => [
        'sms' => [
            'nexmo' => ['channel' => 'nexmo'],

            'twilio' => ['channel' => TwilioChannel::class],

            'africastalking' => ['channel' => AfricasTalkingChannel::class],

            'sns' => ['channel' => SnsChannel::class],
        ],
    ],

    'settings' => [
        'payment_debit' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'payment_credit' => [
            'email'    => true,
            'database' => true,
            'sms'      => true,
        ],

        'wallet_debit' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'wallet_credit' => [
            'email'    => true,
            'database' => true,
            'sms'      => true,
        ],

        'giftcard_purchase' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],

        'user_activity' => [
            'email'    => true,
            'database' => true,
            'sms'      => null,
        ],
    ],
];
