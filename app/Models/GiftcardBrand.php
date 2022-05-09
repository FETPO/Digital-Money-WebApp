<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiftcardBrand extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Related giftcards
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function giftcards()
    {
        return $this->hasMany(Giftcard::class, 'brand_id', 'id');
    }
}
