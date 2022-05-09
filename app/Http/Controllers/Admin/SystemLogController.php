<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemLog;

class SystemLogController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_settings');
    }

    /**
     * Get paginated system logs
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate()
    {
        return paginate(SystemLog::latest()->oldest('seen_at'));
    }

    /**
     * Mark logs as seen
     *
     * @param SystemLog $log
     */
    public function markAsSeen(SystemLog $log)
    {
        $log->markAsSeen();
    }

    /**
     * Mark all logs as seen
     *
     * @return void
     */
    public function markAllAsSeen()
    {
        SystemLog::unseen()->update(['seen_at' => now()]);
    }
}
