<?php
/**
 * ======================================================================================================
 * File Name: Currency.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 7/11/2019 (5:02 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2019. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace NeoScrypts\BitGo;

use ReflectionClass;

class Coin
{
	const BITCOIN = 'btc';
	const TEST_BITCOIN = 'tbtc';

	const BITCOIN_CASH = 'bch';
	const TEST_BITCOIN_CASH = 'tbch';

	const BITCOIN_SV = 'bsv';
	const TEST_BITCOIN_SV = 'tbsv';

	const BITCOIN_GOLD = 'btg';

	const ETHEREUM = 'eth';
	const TEST_ETHEREUM = 'teth';

	const DASH = 'dash';
	const TEST_DASH = 'tdash';

	const LITECOIN = 'ltc';
	const TEST_LITECOIN = 'tltc';

	const RIPPLE = 'xrp';
	const TEST_RIPPLE = 'txrp';

	const ROYAL_MINT_GOLD = 'rmg';
	const TEST_ROYAL_MINT_GOLD = 'trmg';

	const ZCASH = 'zec';
	const TEST_ZCASH = 'tzec';

	public static function allowed()
    {
        return [
            self::BITCOIN,
            self::TEST_BITCOIN,
            self::BITCOIN_CASH,
            self::TEST_BITCOIN_CASH,
            self::BITCOIN_SV,
            self::TEST_BITCOIN_CASH,
            self::BITCOIN_GOLD,
            self::ETHEREUM,
            self::TEST_ETHEREUM,
            self::DASH,
            self::TEST_DASH,
            self::LITECOIN,
            self::TEST_LITECOIN,
            self::RIPPLE,
            self::TEST_RIPPLE,
            self::ROYAL_MINT_GOLD,
            self::TEST_ROYAL_MINT_GOLD,
            self::ZCASH,
            self::TEST_ZCASH,
        ];
    }

	/**
	 * Array of UTXO based coin
	 *
	 * @var array
	 */
	public static function utxoBased() {
	    return [
            self::BITCOIN,
            self::TEST_BITCOIN,
            self::BITCOIN_CASH,
            self::TEST_BITCOIN_CASH,
            self::BITCOIN_SV,
            self::TEST_BITCOIN_CASH,
            self::BITCOIN_GOLD,
            self::DASH,
            self::TEST_DASH,
            self::LITECOIN,
            self::TEST_LITECOIN,
            self::ROYAL_MINT_GOLD,
            self::TEST_ROYAL_MINT_GOLD,
            self::ZCASH,
            self::TEST_ZCASH,
        ];
    }
}
