<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Lang;

class Grid extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'dimensions' => 'array',
        'visible'    => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'title'
    ];

    /**
     * The title attribute for this template
     *
     * @return array|mixed|string|null
     */
    public function getTitleAttribute()
    {
        return trans($this->getTransKey());
    }

    /**
     * Visibility scope
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    /**
     * Visibility scope
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithOrder($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Get translation key for this template's title
     *
     * @return string
     */
    protected function getTransKey()
    {
        return "grid.{$this->name}";
    }
}
