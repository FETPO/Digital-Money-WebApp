<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDocument extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'data',
        'status'
    ];

    /**
     * Requirement
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function requirement()
    {
        return $this->belongsTo(RequiredDocument::class, 'required_document_id', 'id');
    }

    /**
     * Encrypt data
     *
     * @param $value
     */
    public function setDataAttribute($value)
    {
        $this->attributes['data'] = encrypt($value);
    }

    /**
     * Decrypt data
     *
     * @param $value
     * @return mixed
     */
    public function getDataAttribute($value)
    {
        return decrypt($value);
    }

    /**
     * Related user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
