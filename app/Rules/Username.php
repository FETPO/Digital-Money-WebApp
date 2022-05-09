<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Str;

class Username implements Rule
{
    /**
     * Censored usernames
     *
     * @var string[]
     */
    protected $censored = ['root', 'admin'];

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return !Str::contains(strtolower($value), $this->censored) && preg_match('/^[A-z0-9_\-.]+$/', $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The username cannot be accepted.';
    }
}
