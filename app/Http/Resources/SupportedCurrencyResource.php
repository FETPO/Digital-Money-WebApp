<?php

namespace App\Http\Resources;

use App\Models\SupportedCurrency;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SupportedCurrency
 */
class SupportedCurrencyResource extends JsonResource
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
            'code'          => $this->code,
            'name'          => $this->name,
            'default'       => $this->default,
            'exchange_rate' => $this->exchange_rate,
            'exchange_type' => $this->exchange_type,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            $this->mergeWhen(optional($request->user())->can("manage_payments"), [
                'statistic'              => $this->whenLoaded('statistic'),
                'payment_accounts_count' => $this->payment_accounts_count,
            ]),
        ];
    }
}
