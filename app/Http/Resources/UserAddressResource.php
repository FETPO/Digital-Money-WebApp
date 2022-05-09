<?php

namespace App\Http\Resources;

use App\Models\UserAddress;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserAddress
 */
class UserAddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id'       => $this->id,
            'status'   => $this->status,
            'address'  => $this->address,
            'unit'     => $this->unit,
            'city'     => $this->city,
            'postcode' => $this->postcode,
            'state'    => $this->state,
            'user'     => UserResource::make($this->whenLoaded('user'))
        ];
    }
}
