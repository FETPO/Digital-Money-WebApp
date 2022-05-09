<?php

namespace App\Http\Resources;

use App\Models\UserDocument;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserDocument
 */
class UserDocumentResource extends JsonResource
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
            'id'          => $this->id,
            'status'      => $this->status,
            'data'        => $this->data,
            'user'        => UserResource::make($this->whenLoaded('user')),
            'requirement' => RequiredDocumentResource::make($this->whenLoaded('requirement')),
            'created_at'  => $this->created_at,
        ];
    }
}
