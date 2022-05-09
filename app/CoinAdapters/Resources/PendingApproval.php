<?php
/**
 * ======================================================================================================
 * File Name: PendingApproval.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 10/23/2020 (12:19 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\CoinAdapters\Resources;

class PendingApproval extends Resource
{
    protected array $rules = [
        'id'    => 'required|string',
        'state' => 'required|string',
        'hash'  => 'nullable|string',
        'data'  => 'nullable|array'
    ];

    /**
     * @return string
     */
    public function getId()
    {
        return $this->get('id');
    }

    /**
     * Lock key for synchronization
     *
     * @return string
     */
    public function lockKey()
    {
        return $this->getId();
    }

    /**
     * @return string
     */
    public function getState()
    {
        return $this->get('state');
    }

    /**
     * Transaction hash
     *
     * @return string
     */
    public function getHash()
    {
        return $this->get('hash');
    }

    /**
     * Check if pending withdrawal is approved
     *
     * @return bool
     */
    public function approved()
    {
        return $this->getState() == 'approved' && $this->getHash();
    }

    /**
     * @return string
     */
    public function getData()
    {
        return $this->get('data');
    }
}
