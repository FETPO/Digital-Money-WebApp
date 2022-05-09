<?php
/**
 * ======================================================================================================
 * File Name: Helper.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 12/4/2020 (12:03 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\Helpers;


use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use UnexpectedValueException;

trait InteractsWithStore
{
    /**
     * Store instance
     *
     * @var ValueStore
     */
    protected $store;

    /**
     * Verification prefix
     *
     * @var string
     */
    protected $prefix;

    /**
     * Initialize store helper
     *
     * @return void
     */
    public function __construct($prefix = null)
    {
        $this->prefix = $prefix;
        $this->store = valueStore();
        $this->initialize();
    }

    /**
     * Initialize children
     *
     * @return void
     */
    protected function initialize()
    {
        if (property_exists($this, 'children')) {
            collect($this->children)->each(function ($child, $key) {
                if (class_exists($child) && is_string($key)) {
                    $this->{$key} = new $child($this->key($key));
                }
            });
        }
    }

    /**
     * Get key name
     *
     * @param $name
     * @return string
     */
    protected function key($name)
    {
        return Str::camel(is_string($this->prefix) ? "$this->prefix.$name" : $name);
    }

    /**
     * Put in store
     *
     * @param $name
     * @param $value
     * @return InteractsWithStore
     */
    public function put($name, $value)
    {
        $this->validateName($name);
        $this->store->put($this->key($name), $value);
        return $this;
    }

    /**
     * Get from store
     *
     * @param $name
     * @return array|string|null
     */
    public function get($name)
    {
        $default = $this->validateName($name);
        return $this->store->get($this->key($name), $default);
    }

    /**
     * Check if key exists in store
     *
     * @param $name
     * @return bool
     */
    public function has($name)
    {
        return $this->store->has($this->key($name));
    }

    /**
     * Validate settings name
     *
     * @param $name
     * @return array
     */
    protected function validateName($name)
    {
        $attributes = $this->attributes();

        if (!Arr::has($attributes, $name)) {
            throw new UnexpectedValueException("Invalid Property: {$name}");
        }

        return Arr::get($attributes, $name);
    }

    /**
     * Get attributes
     *
     * @return array
     */
    protected function attributes()
    {
        return !property_exists($this, 'attributes') ? [] : $this->attributes;
    }

    /**
     * Get all values
     *
     * @return array
     */
    public function all()
    {
        return collect($this->attributes())
            ->map(function ($default, $name) {
                return $this->store->get($this->key($name), $default);
            })
            ->toArray();
    }
}
