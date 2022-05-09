<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ProtectField implements Rule
{
    /**
     * Expected field value
     *
     * @var mixed
     */
    protected $value;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($value)
    {
        $this->value = $value;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return is_null($this->value) || $value == $this->value;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.protected');
    }
}
