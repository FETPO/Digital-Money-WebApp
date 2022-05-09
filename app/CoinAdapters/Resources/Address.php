<?php
/**
 * ======================================================================================================
 * File Name: Address.php
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


class Address extends Resource
{
	protected array $rules = [
		'id'      => 'required|string',
		'label'   => 'required|string',
		'address' => 'required|string',
		'data'    => 'nullable|array'
	];

    /**
     * @return string
     */
	public function getId()
	{
		return $this->get('id');
	}

    /**
     * @return string
     */
	public function getLabel()
	{
		return $this->get('label');
	}

    /**
     * @return string
     */
	public function getAddress()
	{
		return $this->get('address');
	}

    /**
     * @return array
     */
	public function getData()
	{
		return $this->get('data');
	}
}
