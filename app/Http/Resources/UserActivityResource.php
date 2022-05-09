<?php

namespace App\Http\Resources;

use App\Models\UserActivity;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserActivity
 */
class UserActivityResource extends JsonResource
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
            'action'       => $this->action,
            'source'       => $this->source,
            'agent'        => $this->agent,
            'parsed_agent' => $this->parsed_agent,
            'ip'           => $this->ip,
            'location'     => $this->location,
            'created_at'   => $this->created_at,
        ];
    }
}
