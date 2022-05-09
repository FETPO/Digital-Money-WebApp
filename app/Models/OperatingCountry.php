<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatingCountry extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'code';

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function (self $record) {
            $record->code = strtoupper($record->code);
        });
    }

    /**
     * Related banks
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function banks()
    {
        return $this->belongsToMany(Bank::class, 'operating_country_bank', 'operating_country_code', 'bank_id')
            ->withTimestamps();
    }
}
