<?php

namespace App\Http\Resources;

use App\Models\ExchangeTrade;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

/**
 * @mixin ExchangeTrade
 */
class ExchangeTradeResource extends JsonResource
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
            'id'                           => $this->id,
            'status'                       => $this->status,
            'type'                         => $this->type,
            'payment_value'                => $this->payment_value,
            'formatted_payment_value'      => $this->formatted_payment_value,
            'wallet_value'                 => $this->wallet_value,
            'wallet_value_price'           => $this->wallet_value_price,
            'formatted_wallet_value_price' => $this->formatted_wallet_value_price,
            'dollar_price'                 => $this->dollar_price,
            'completed_at'                 => $this->completed_at,
            'coin'                         => CoinResource::make($this->whenAppended('coin')),
            'trader'                       => UserResource::make($this->whenLoaded('trader')),
            'payment_currency'             => $this->payment_currency,
            'payment_symbol'               => $this->payment_symbol,
            'created_at'                   => $this->created_at,
            'updated_at'                   => $this->updated_at,
            $this->mergeWhen(optional($request->user())->can("manage_exchange"), [
                'wallet_account' => WalletAccountResource::make($this->whenLoaded('walletAccount'))
            ])
        ];
    }
}
