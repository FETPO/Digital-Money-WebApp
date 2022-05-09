<?php

namespace App\Http\Resources;

use App\Models\OperatingCountry;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OperatingCountry
 */
class OperatingCountryResource extends JsonResource
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
            'code'       => $this->code,
            'name'       => $this->name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            $this->mergeWhen(optional($request->user())->can("manage_banks"), [
                'banks_count' => $this->banks_count
            ])
        ];
    }
}
