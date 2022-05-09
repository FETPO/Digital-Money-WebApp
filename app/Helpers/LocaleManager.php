<?php

namespace App\Helpers;


use Barryvdh\TranslationManager\Manager;
use Illuminate\Contracts\Translation\Loader;
use Illuminate\Support\Facades\File;

class LocaleManager
{
    protected $path;

    /**
     * Cache loaded locale lines
     *
     * @var array|null
     */
    protected $loadedLines;

    /**
     * @var Loader
     */
    protected $loader;

    /**
     * @var Manager
     */
    protected $manager;

    /**
     * LocaleManager constructor.
     */
    public function __construct()
    {
        $this->loader = app('translation.loader');
        $this->path = resource_path('lang');
        $this->manager = app('translation-manager');
    }

    /**
     * @return array
     */
    public function getSupportedLocales()
    {
        return array_intersect($this->manager->getLocales(), $this->getJsonLocales());
    }

    /**
     * @return array
     */
    public function getSupportedLocalesDetails()
    {
        $data = config()->get('locales');
        $locales = $this->getSupportedLocales();

        return collect($data)->only($locales)
            ->mapWithKeys(function ($item, $key) {
                [$locale, $region] = explode('_', $item['regional']);

                return [
                    $key => [
                        'name'   => $item['name'],
                        'native' => $item['native'],
                        'region' => strtolower($region),
                        'locale' => $locale
                    ]
                ];
            })->toArray();
    }

    /**
     * Get array of locales based on available files
     *
     * @return array
     */
    protected function getJsonLocales()
    {
        return collect(File::files($this->path))
            ->filter(function ($value) {
                return preg_match('/^.*\.(json)$/i', $value);
            })
            ->map(function ($value) {
                return basename($value, '.json');
            })
            ->values()->toArray();
    }

    /**
     * Get translation lines as array
     *
     * @param $locale
     * @return mixed
     */
    public function getJsonLines($locale = null)
    {
        if (!$locale) {
            $locale = app()->getLocale();
        }

        $this->loadJsonLines($locale);

        return $this->loadedLines[$locale];
    }

    /**
     * Load json files as array
     *
     * @param $locales
     */
    protected function loadJsonLines($locales)
    {
        $locales = !is_array($locales) ? [$locales] : $locales;

        foreach ($locales as $locale) {
            if (isset($this->loadedLines[$locale])) {
                continue;
            }

            $line = $this->loader->load($locale, '*', '*');
            $this->loadedLines[$locale] = $line;
        }
    }
}
