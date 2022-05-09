<?php

namespace App\Http\Resources;

use App\Models\FeatureLimit;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin FeatureLimit
 */
class FeatureLimitResource extends JsonResource
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
            'name'             => $this->name,
            'title'            => $this->title,
            'unverified_limit' => $this->unverified_limit,
            'basic_limit'      => $this->basic_limit,
            'advanced_limit'   => $this->advanced_limit,
            'type'             => $this->type,
            'period'           => $this->period,
            'usage'            => $this->getTotalUsage($request->user()),
            'limit'            => $this->getActiveLimit($request->user()),
            'available'        => $this->getAvailable($request->user()),
        ];
    }
}
