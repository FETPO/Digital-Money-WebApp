<?php

namespace App\Models;

use App\Helpers\CoinFormatter;
use App\Models\Traits\HasAdapterResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class PendingApproval extends Model
{
    use HasFactory, HasAdapterResource;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['resource'];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = [
        'transferRecord',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|Wallet
     */
    public function transferRecord()
    {
        return $this->belongsTo(TransferRecord::class, 'transfer_record_id', 'id');
    }
}
