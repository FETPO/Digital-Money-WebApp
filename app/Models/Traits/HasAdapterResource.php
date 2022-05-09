<?php
/**
 * ======================================================================================================
 * File Name: HasAdapterResource.php
 * ======================================================================================================
 * Author: NeoScrypts
 * ------------------------------------------------------------------------------------------------------
 * Portfolio: http://codecanyon.net/user/holluwatosin360
 * ------------------------------------------------------------------------------------------------------
 * Date & Time: 12/29/2020 (5:01 PM)
 * ------------------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2020. This project is released under the standard of CodeCanyon License.
 * You may NOT modify/redistribute this copy of the project. We reserve the right to take legal actions
 * if any part of the license is violated. Learn more: https://codecanyon.net/licenses/standard.
 *
 * ------------------------------------------------------------------------------------------------------
 */

namespace App\Models\Traits;


trait HasAdapterResource
{
    /**
     * Initialize trait
     *
     * @return void
     */
    protected function initializeHasAdapterResource()
    {
        $this->makeHidden('resource');
    }

    /**
     * Serialize resource object.
     *
     * @param string $value
     * @return void
     */
    public function setResourceAttribute($value)
    {
        $this->attributes['resource'] = serialize($value);
    }

    /**
     * Unserialize resource object.
     *
     * @param string $value
     * @return void
     */
    public function getResourceAttribute($value)
    {
        return unserialize($value);
    }
}
