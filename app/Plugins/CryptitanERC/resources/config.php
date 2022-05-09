<?php

use App\Plugins\CryptitanERC\CoinAdapter;

return [
    "gas_limit"    => env(CoinAdapter::SYMBOL . "_GAS_LIMIT", 60000),
    "dollar_price" => env(CoinAdapter::SYMBOL . "_DOLLAR_PRICE"),
];