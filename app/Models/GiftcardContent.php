<?php

namespace App\Models;

use App\Models\Traits\Lock;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GiftcardContent extends Model
{
    use HasFactory, Lock;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'code'      => 'encrypted',
        'bought_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['code'];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['giftcard', 'buyer'];

    /**
     * The giftcard
     *
     * @return BelongsTo
     */
    public function giftcard()
    {
        return $this->belongsTo(Giftcard::class, 'giftcard_id', 'id');
    }

    /**
     * The buyer
     *
     * @return BelongsTo
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id', 'id');
    }

    /**
     * @param User $user
     * @return bool
     */
    public function canViewCode($user)
    {
        return optional($user)->is($this->buyer) || optional($user)->can("manage_giftcards");
    }
}
