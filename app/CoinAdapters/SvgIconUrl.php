<?php

namespace App\CoinAdapters;

trait SvgIconUrl
{
    /**
     * @inheritDoc
     */
    public function getSvgIcon()
    {
        return asset($this->getSvgIconPath());
    }
}