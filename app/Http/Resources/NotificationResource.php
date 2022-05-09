<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'type'       => $this->type,
            'data'       => $this->data,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'read_at'    => $this->read_at,
        ];
    }
}
