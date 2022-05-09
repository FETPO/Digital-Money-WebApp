<?php
/**
 * ======================================================================================================
 * File Name: Transaction.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 10/16/2019 (8:04 AM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2019. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\CoinAdapters\Resources;

use App\CoinAdapters\Exceptions\AdapterException;
use App\CoinAdapters\Exceptions\ValidationException;
use Brick\Math\BigDecimal;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class Transaction extends Resource
{
    protected array $rules = [
        'id'            => 'required|string',
        'hash'          => 'required|string',
        'confirmations' => 'required|numeric',
        'date'          => 'required|string',
        'value'         => 'required|numeric',
        'type'          => 'required|string',
        'data'          => 'nullable|array'
    ];

    /**
     * Transaction constructor.
     *
     * @param array $data
     * @throws AdapterException
     * @throws ValidationException
     */
    public function __construct(array $data)
    {
        parent::__construct($data);
        $this->validateAddress($this->getOutput());
        $this->validateAddress($this->getInput());
    }

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
    public function getHash()
    {
        return $this->get('hash');
    }

    /**
     * @return Carbon
     */
    public function getDate()
    {
        return Carbon::parse($this->get('date'));
    }

    /**
     * @return int
     */
    public function getConfirmations()
    {
        return $this->get('confirmations');
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return (string) BigDecimal::of($this->get('value'))->abs();
    }

    /**
     * @return array|string
     */
    public function getInput()
    {
        return $this->get('input');
    }

    /**
     * @return array|string
     */
    public function getOutput()
    {
        return $this->get('output');
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->get('type');
    }

    /**
     * @return array
     */
    public function getData()
    {
        return $this->get('data');
    }

    /**
     * Lock key for synchronization
     *
     * @return string
     */
    public function lockKey()
    {
        return $this->getHash();
    }

    /**
     * Validate inputs and outputs
     *
     * @param $address
     * @throws AdapterException
     */
    protected function validateAddress($address)
    {
        if (is_array($address)) {
            collect($address)->each(function ($object) {
                if (!is_array($object)) {
                    throw new AdapterException("Address is expected to be an array of objects.");
                }

                if (!Arr::has($object, ['address', 'value'])) {
                    throw new AdapterException("Objects should contain address, value pairs.");
                }
            });
        }
    }
}
