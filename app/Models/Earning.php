<?php

namespace App\Models;

use App\Helpers\CoinFormatter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Earning extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Record wallet earnings
     *
     * @param CoinFormatter $value
     * @param string $description
     * @param User $receiver
     * @return void
     */
    public static function wallet(CoinFormatter $value, string $description, User $receiver)
    {
        $earning = new self([
            'value'       => $value->getPrice(),
            'type'        => 'wallet',
            'description' => $description,
        ]);
        $earning->receiver()->associate($receiver);
        $earning->save();
    }

    /**
     * Receiver object
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'id');
    }
}
