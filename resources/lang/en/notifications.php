<?php

return [
    "verify_email" => [
        "title" => "Verify Email",
        "mail"  => [
            "greeting" => 'Hi, :username',
            "subject"  => 'Verify Email Address',
            "content"  => 'Please click the button below to verify your email address.',
            "action"   => 'Verify',
        ]
    ],

    "phone_token" => [
        "title" => "Phone Token",
        "sms"   => [
            "content" => ":code is your verification code, it expires in :minutes minutes."
        ]
    ],

    "email_token" => [
        "title" => "Email Token",
        "mail"  => [
            "greeting" => 'Hi, :username',
            "subject"  => 'OTP Request',
            "content"  => "<b>:code</b> is your verification code, it expires in <b>:minutes</b> minutes.",
        ]
    ],

    "payment_debit" => [
        "title"    => "Sent payment",
        "mail"     => [
            "greeting" => 'Hi, :username',
            "subject"  => 'DEBIT: Your :currency account was debited with -:formatted_value',
            "content"  => "Your <b>:currency</b> account was debited with <b>-:formatted_value</b>",
        ],
        "sms"      => [
            "content" => 'Your :currency account was debited with -:formatted_value',
        ],
        "database" => [
            "content" => 'Your :currency account was debited with -:formatted_value',
        ],
    ],

    "payment_credit" => [
        "title"    => "Received payment",
        "mail"     => [
            "greeting" => 'Hi, :username',
            "subject"  => 'CREDIT: Your :currency account was credited with :formatted_value',
            "content"  => "Your <b>:currency</b> account was credited with <b>:formatted_value</b>",
        ],
        "sms"      => [
            "content" => 'Your :currency account was credited with :formatted_value',
        ],
        "database" => [
            "content" => 'Your :currency account was credited with :formatted_value',
        ],
    ],

    "giftcard_purchase" => [
        "title"    => "Giftcard purchase",
        "mail"     => [
            "greeting" => 'Hi, :username',
            "subject"  => 'Thank you for your purchase!',
            "content"  => "We are happy to inform you that your <b>:items_count</b> giftcard purchases of <b>:total</b> in total is now available in your account.",
        ],
        "sms"      => [
            "content" => 'Your :items_count giftcard purchases of :total is now available in your account.',
        ],
        "database" => [
            "content" => 'Your :items_count giftcard purchases of :total is now available in your account.',
        ],
    ],

    "user_activity" => [
        "title"    => "Account changes",
        "mail"     => [
            "greeting" => 'Hi, :username',
            "subject"  => 'Change detected in your account',
            "content"  => "We detected the activity: <b>:action</b> on your account <br/> <br/> IP address: <b>:ip</b>  <br/> Browser: <b>:agent</b> <br/> Country: <b>:country</b>  <br/> <br/> If this was not you, please contact our help center as soon as possible."
        ],
        "sms"      => [
            "content" => 'We detected the following activity on your account: :action'
        ],
        "database" => [
            "content" => 'We detected the following activity on your account: :action'
        ],
    ],

    "wallet_debit" => [
        "title"    => "Sent crypto",
        "mail"     => [
            "greeting" => 'Hi, :username',
            "subject"  => 'DEBIT: Your :coin account was debited with -:value',
            "content"  => "Your <b>:coin</b> account was debited with <b>-:value</b> (-:formatted_value_price)",
        ],
        "sms"      => [
            "content" => 'Your :coin account was debited with -:value (-:formatted_value_price)',
        ],
        "database" => [
            "content" => 'Your :coin account was debited with -:value (-:formatted_value_price)',
        ],
    ],

    "wallet_credit" => [
        "title"    => "Received crypto",
        "mail"     => [
            "greeting" => 'Hi, :username',
            "subject"  => 'CREDIT: Your :coin account was credited with :value',
            "content"  => "Your <b>:coin</b> account was credited with <b>:value</b> (:formatted_value_price)",
        ],
        "sms"      => [
            "content" => 'Your :coin account was credited with :value (:formatted_value_price)',
        ],
        "database" => [
            "content" => 'Your :coin account was credited with :value (:formatted_value_price)',
        ]
    ]
];