<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use UAParser\Parser;

class UserActivity extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'location' => 'array',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'parsed_agent'
    ];

    /**
     * Pretty print user agent
     *
     * @return string
     * @throws \UAParser\Exception\FileNotFoundException
     */
    public function getParsedAgentAttribute()
    {
        $parser = Parser::create();
        $result = $parser->parse($this->agent);
        return $result->toString();
    }
}
