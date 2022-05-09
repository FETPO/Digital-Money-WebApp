<?php

namespace App\Plugins\ShibaInuERC;

use App\Abstracts\TokenServiceProvider;

class PluginServiceProvider extends TokenServiceProvider
{
    const MOCK_TOKEN = false;

    /**
     * @inheritDoc
     */
    protected function getAdapter()
    {
        return CoinAdapter::class;
    }

    /**
     * @inheritDoc
     */
    protected function configName()
    {
        return CoinAdapter::configName();
    }

    /**
     * @inheritDoc
     */
    protected function resourcePath()
    {
        return __DIR__ . '/resources';
    }
}