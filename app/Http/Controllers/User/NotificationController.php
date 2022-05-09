<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Paginate notification
     *
     * @return AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(Auth::user()->notifications());
        return NotificationResource::collection($records);
    }

    /**
     * Mark as read
     *
     * @return NotificationResource
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        return NotificationResource::make(tap($notification)->markAsRead());
    }

    /**
     * Count total unread
     *
     * @return array
     */
    public function totalUnread()
    {
        return [
            'total' => Auth::user()->unreadNotifications()->count()
        ];
    }

    /**
     * Mark all as read
     *
     * @return void
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);
    }

    /**
     * Clear all notifications
     *
     * @return void
     */
    public function clear()
    {
        Auth::user()->notifications()->delete();
    }
}
