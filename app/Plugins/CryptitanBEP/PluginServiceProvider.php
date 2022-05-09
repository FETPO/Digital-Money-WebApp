<?php

namespace App\Plugins\CryptitanBEP;

use App\Abstracts\TokenServiceProvider;

class PluginServiceProvider extends TokenServiceProvider
{
    const MOCK_TOKEN = true;

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