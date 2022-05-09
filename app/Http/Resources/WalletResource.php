<?php

namespace App\Http\Resources;

use App\Models\Wallet;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Wallet
 */
class WalletResource extends JsonResource
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
            'id'           => $this->id,
            'consolidates' => $this->consolidates,
            'min_conf'     => $this->min_conf,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
            'coin'         => CoinResource::make($this->whenLoaded('coin')),

            $this->mergeWhen(optional($request->user())->can("manage_wallets"), [
                'properties'     => $this->properties,
                'statistic'      => $this->whenLoaded('statistic'),
                'withdrawal_fee' => $this->whenLoaded('withdrawalFee'),
                'exchange_fees'  => $this->whenLoaded('exchangeFees'),
                'accounts_count' => $this->accounts_count,
            ]),
        ];
    }
}
