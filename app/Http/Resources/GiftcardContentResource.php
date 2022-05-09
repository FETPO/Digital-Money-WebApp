<?php

namespace App\Http\Resources;

use App\Models\GiftcardContent;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin GiftcardContent
 */
class GiftcardContentResource extends JsonResource
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
            'id'         => $this->id,
            'giftcard'   => GiftcardResource::make($this->whenLoaded('giftcard')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'bought_at'  => $this->bought_at,

            $this->mergeWhen($this->canViewCode($request->user()), [
                'serial'      => $this->serial,
                'code'        => $this->code,
                'instruction' => $this->giftcard->instruction,
            ]),

            $this->mergeWhen(optional($request->user())->can("manage_giftcards"), [
                'buyer' => UserResource::make($this->whenLoaded('buyer')),
            ]),
        ];
    }
}
