<?php

namespace App\Http\Resources;

use App\Models\BankAccount;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin BankAccount
 */
class BankAccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id'          => $this->id,
            'bank_name'   => $this->bank_name,
            'bank_logo'   => $this->bank_logo,
            'beneficiary' => $this->beneficiary,
            'number'      => $this->number,
            'currency'    => $this->currency,
            'country'     => $this->country,
            'note'        => $this->note,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
