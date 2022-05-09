<?php
/**
 * ======================================================================================================
 * File Name: Wallet.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 10/16/2019 (9:46 AM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2019. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\CoinAdapters\Resources;

class Wallet extends Resource
{
	protected array $rules = [
		'id'      => 'required|string',
		'data'    => 'nullable|array'
	];

    /**
     * Get source id
     *
     * @return string
     */
	public function getId()
	{
		return $this->get('id');
	}

    /**
     * Get wallet data
     *
     * @return array
     */
	public function getData()
	{
		return $this->get('data');
	}
}
