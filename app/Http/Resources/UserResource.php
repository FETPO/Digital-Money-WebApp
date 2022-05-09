<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
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
            'name'         => $this->name,
            'presence'     => $this->presence,
            'last_seen_at' => $this->last_seen_at,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,

            $this->mergeWhen(optional($request->user())->canViewUser($this->resource), [
                'profile'               => UserProfileResource::make($this->whenLoaded('profile')),
                'email'                 => $this->email,
                'phone'                 => $this->phone,
                'two_factor_enable'     => $this->two_factor_enable,
                'currency'              => $this->currency,
                'country'               => $this->country,
                'rank'                  => $this->rank,
                'country_operation'     => $this->country_operation,
                'phone_verified_at'     => $this->phone_verified_at,
                'email_verified_at'     => $this->email_verified_at,
                'deactivated_until'     => $this->deactivated_until,
                'notifications_read_at' => $this->notifications_read_at,
                'last_login_at'         => $this->last_login_at,
                'location'              => $this->location,
                'is_super_admin'        => $this->is_super_admin,
                'all_permissions'       => $this->all_permissions,
                'all_roles'             => $this->all_roles,
            ]),

            $this->mergeWhen(optional($request->user())->isNot($this->resource), [
                'updatable' => $request->user()->canUpdateUser($this->resource),
                'deletable' => $request->user()->canDeleteUser($this->resource),
            ])
        ];
    }
}
