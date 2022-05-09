<?php

namespace App\Http\Resources;

use App\Models\Giftcard;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Giftcard
 */
class GiftcardResource extends JsonResource
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

        $price = $this->getPrice($request->user());

        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'label'           => $this->label,
            'thumbnail'       => $this->thumbnail,
            'description'     => $this->description,
            'stock'           => $this->stock,
            'value'           => $this->value,
            'formatted_value' => $this->formatted_value,
            'currency'        => $this->currency,
            'brand'           => GiftcardBrandResource::make($this->whenLoaded('brand')),
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
            'price'           => $price->getValue(),
            'formatted_price' => $price->format(),

            $this->mergeWhen(optional($request->user())->can("manage_giftcards"), [
                'contents_count' => $this->contents_count,
                'instruction'    => $this->instruction,
            ])
        ];
    }
}
