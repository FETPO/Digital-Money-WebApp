<?php

namespace App\Http\Resources;

use App\Models\GiftcardBrand;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin GiftcardBrand
 */
class GiftcardBrandResource extends JsonResource
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
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,

            $this->mergeWhen(optional($request->user())->can("manage_giftcards"), [
                'giftcards_count' => $this->giftcards_count
            ])
        ];
    }
}
