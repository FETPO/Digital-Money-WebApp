<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class VerifiedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return !is_null($this->user());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->user()->enabledTwoFactor()) {
            return [
                'token' => [
                    'required', 'bail',
                    function ($attribute, $value, $fail) {
                        if (!$this->user()->verifyTwoFactorToken($value)) {
                            $fail(trans('auth.invalid_token'));
                        }
                    },
                ]
            ];
        } else {
            return [
                'password' => [
                    'required', 'bail',
                    function ($attribute, $value, $fail) {
                        if (!Hash::check($value, $this->user()->password)) {
                            $fail(trans('auth.invalid_password'));
                        }
                    },
                ],
            ];
        }
    }
}
