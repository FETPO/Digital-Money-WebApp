<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Earning;
use App\Models\PaymentTransaction;
use App\Models\SystemLog;
use App\Models\User;
use App\Models\UserDocument;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class StatisticsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:access_control_panel');
    }

    /**
     * Total users
     *
     * @return array
     */
    public function totalUsers()
    {
        return [
            'total' => User::query()->count()
        ];
    }

    /**
     * Total earnings
     *
     * @return array
     */
    public function totalEarnings()
    {
        return [
            'total' => Earning::query()->sum("value")
        ];
    }

    /**
     * Pending verification
     *
     * @return array
     */
    public function pendingVerification()
    {
        return [
            'total' => UserDocument::where('status', 'pending')->count()
        ];
    }

    /**
     * Pending withdrawals
     *
     * @return array
     */
    public function pendingWithdrawal()
    {
        return [
            'total' => PaymentTransaction::pendingTransfer()->where('type', 'send')->count()
        ];
    }

    /**
     * Pending deposits
     *
     * @return array
     */
    public function pendingDeposit()
    {
        return [
            'total' => PaymentTransaction::pendingTransfer()->where('type', 'receive')->count()
        ];
    }

    /**
     * Get system's log summary
     *
     * @return array
     */
    public function systemStatus()
    {
        $result = SystemLog::unseen()
            ->selectRaw('count(*) as total, level')
            ->groupBy('level')->get()
            ->pluck('total', 'level');

        return [
            "error"   => $result->get("error"),
            "warning" => $result->get("warning"),
            "info"    => $result->get("info"),
            "total"   => $result->sum(),
        ];
    }

    /**
     * Get registration chart
     *
     * @param Request $request
     * @return Collection|\Illuminate\Support\HigherOrderTapProxy|mixed
     */
    public function registrationChart(Request $request)
    {
        $month = $request->get('month') ?: now()->month;
        $year = $request->get('year') ?: now()->year;
        $starts = Carbon::createFromDate($year, $month, 1);
        $ends = $starts->clone()->endOfMonth();

        $aggregate = User::query()
            ->selectRaw('day(created_at) as day')
            ->selectRaw('count(*) as total')
            ->whereDate('created_at', '>=', $starts)
            ->whereDate('created_at', '<=', $ends)
            ->groupBy('day')->get()
            ->pluck('total', 'day');

        return tap(new Collection(), function ($collection) use ($starts, $aggregate) {
            for ($day = 1; $day <= $starts->daysInMonth; $day++) {
                $current = $starts->clone()->day($day);
                $collection->push([
                    'total' => $aggregate->get($day, 0),
                    'date'  => $current->toDateString(),
                ]);
            }
        });
    }

    /**
     * Get latest users
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function latestUsers()
    {
        return UserResource::collection(User::latest()->limit(10)->get());
    }
}
