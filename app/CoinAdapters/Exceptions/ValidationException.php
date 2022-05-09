<?php
/**
 * ======================================================================================================
 * File Name: ValidationException.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 10/16/2019 (5:38 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2019. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\CoinAdapters\Exceptions;


use Exception;
use Illuminate\Contracts\Validation\Validator;

class ValidationException extends Exception
{
    /**
     * The validator instance.
     *
     * @var Validator
     */
    public Validator $validator;


    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public int $status = 500;


    /**
     * Create a new exception instance.
     *
     * @param Validator $validator
     */
    public function __construct($validator)
    {
        parent::__construct("The given data is invalid.");

        $this->validator = $validator;
    }

    /**
     * Get all the validation error messages.
     *
     * @return array
     */
    public function errors()
    {
        return $this->validator->errors()->messages();
    }

    /**
     * Set the HTTP status code to be used for the response.
     *
     * @param int $status
     * @return $this
     */
    public function status(int $status)
    {
        $this->status = $status;

        return $this;
    }
}
