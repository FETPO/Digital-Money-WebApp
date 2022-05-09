<?php

namespace App\Models;

use App\Models\Traits\HasAdapterResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletAddress extends Model
{
    use HasFactory, HasAdapterResource;

    protected $totalReceived;
    protected $totalReceivedObject;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'address';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'resource'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'total_received',
        'total_received_price',
        'formatted_total_received_price',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'address',
        'label',
        'resource'
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['walletAccount'];

    /**
     * Sum total received
     *
     * @return mixed
     */
    public function getTotalReceived()
    {
        if (!isset($this->totalReceived)) {
            $this->totalReceived = $this->transferRecords()
                ->where('type', 'receive')
                ->whereColumn('confirmations', '>=', 'required_confirmations')
                ->sum('value');
        }
        return $this->totalReceived;
    }

    /**
     * @return \App\Helpers\CoinFormatter
     */
    public function getTotalReceivedObject()
    {
        if (!isset($this->totalReceivedObject)) {
            $this->totalReceivedObject = coin($this->getTotalReceived(), $this->walletAccount->wallet->coin);
        }
        return $this->totalReceivedObject;
    }

    /**
     * @return float
     */
    public function getTotalReceivedAttribute()
    {
        return $this->getTotalReceivedObject()->getValue();
    }

    /**
     * @return float|string
     */
    public function getTotalReceivedPriceAttribute()
    {
        return $this->getTotalReceivedObject()->getPrice($this->walletAccount->user->currency);
    }

    /**
     * @return string
     */
    public function getFormattedTotalReceivedPriceAttribute()
    {
        return $this->getTotalReceivedObject()->getFormattedPrice($this->walletAccount->user->currency);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|Wallet
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|WalletAccount
     */
    public function walletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'wallet_account_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|TransferRecord
     */
    public function transferRecords()
    {
        return $this->hasMany(TransferRecord::class, 'address', 'address')
            ->where('wallet_account_id', $this->wallet_account_id);
    }
}
