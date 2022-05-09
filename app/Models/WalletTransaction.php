<?php

namespace App\Models;

use App\Models\Traits\HasAdapterResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory, HasAdapterResource;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['resource'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'date'          => 'datetime',
        'confirmations' => 'integer',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Wallet relation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|Wallet
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }

    /**
     * Transfer record relation
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|TransferRecord
     */
    public function transferRecords()
    {
        return $this->hasMany(TransferRecord::class, 'wallet_transaction_id', 'id');
    }
}
