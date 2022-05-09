<?php
/**
 * ======================================================================================================
 * File Name: Resource.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 12/30/2020 (11:45 AM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\CoinAdapters\Resources;


use App\CoinAdapters\Exceptions\ValidationException;
use Illuminate\Support\Facades\Validator;

abstract class Resource
{
    /**
     * Resource
     *
     * @var array
     */
    protected array $resource;

    /**
     * Resource constructor.
     *
     * @param array $data
     * @throws ValidationException
     */
    public function __construct(array $data)
    {
        $this->parse($data);
    }

    /**
     * @param $name
     * @return mixed|null
     */
    public function get($name)
    {
        return collect($this->resource)->get($name);
    }

    /**
     * @param array $data
     * @throws ValidationException
     */
    protected function parse(array $data)
    {
        $validator = Validator::make($data, $this->rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $this->resource = $data;
    }
}
