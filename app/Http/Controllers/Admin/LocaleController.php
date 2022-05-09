<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Barryvdh\TranslationManager\Manager;
use Barryvdh\TranslationManager\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LocaleController extends Controller
{
    /**
     * @var Manager
     */
    protected Manager $manager;

    /**
     * GeneralController constructor.
     *
     * @param Manager $manager
     * @throws \Exception
     */
    public function __construct(Manager $manager)
    {
        $this->middleware('permission:manage_localization');
        $this->manager = $manager;
    }

    /**
     * Get translation data
     *
     * @return array
     */
    public function get()
    {
        return [
            'locales' => $this->availableLocales()->values(),
            'groups'  => $this->availableGroups()->values()
        ];
    }

    /**
     * Add locale
     *
     * @param Request $request
     * @return void
     * @throws ValidationException
     */
    public function add(Request $request)
    {
        $supported = array_keys(config('locales'));

        $validated = $this->validate($request, [
            'locale' => ['required', Rule::in($supported)]
        ]);

        $locale = $validated['locale'];

        if (!$this->availableLocales()->has($locale)) {
            $this->manager->addLocale($locale);
        }
    }

    /**
     * Remove locale
     *
     * @param Request $request
     * @return void
     * @throws ValidationException
     */
    public function remove(Request $request)
    {
        $validated = $this->validate($request, [
            'locale' => ['required', Rule::notIn(['en'])]
        ]);

        $locale = $validated['locale'];

        $this->manager->removeLocale($locale);
    }

    /**
     * Import translation keys
     *
     * @param Request $request
     * @return void
     * @throws \Illuminate\Validation\ValidationException
     */
    public function import(Request $request)
    {
        $validated = $this->validate($request, [
            'replace' => 'required|boolean'
        ]);

        $replace = $validated['replace'];

        $this->manager->importTranslations($replace);
    }

    /**
     * Get group data
     *
     * @param $group
     * @return array
     */
    public function getGroup(Request $request, $group)
    {
        return [
            'locales'      => $this->availableLocales()->values(),
            'translations' => $this->getGroupTranslations($request, $group),
            'changed'      => $this->countChangedGroupKeys($group),
        ];
    }

    /**
     * Get group translations
     *
     * @param Request $request
     * @param $group
     * @return Collection
     */
    protected function getGroupTranslations(Request $request, $group)
    {
        $query = Translation::where('group', $group)
            ->orderBy('key', 'asc');

        if ($search = $request->get('search')) {
            $query->where('value', 'like', "%{$search}%");
        }

        $translations = collect($query->get())
            ->groupBy(['key', 'locale'])
            ->map(function (Collection $locales, $key) {
                return $locales->put('key', $key);
            });

        return $translations->values();
    }

    /**
     * Count changed group keys
     *
     * @param null $group
     * @return mixed
     */
    protected function countChangedGroupKeys($group)
    {
        return Translation::where('group', $group)
            ->where('status', Translation::STATUS_CHANGED)
            ->count();
    }

    /**
     * Export group keys
     *
     * @param $group
     */
    public function exportGroup($group)
    {
        $this->manager->exportTranslations($group, $group === "_json");
    }

    /**
     * Update group translation
     *
     * @param Request $request
     * @param $group
     * @throws ValidationException
     */
    public function updateGroup(Request $request, $group)
    {
        if (!$this->availableGroups()->has($group)) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $allowed = collect($this->manager->getLocales());

        $validated = $this->validate($request, [
            'key'       => ['required', 'string'],
            'locales'   => ['required', 'array:' . $allowed->implode(',')],
            'locales.*' => ['required', 'string']
        ]);

        foreach ($validated['locales'] as $locale => $value) {
            Translation::updateOrCreate([
                'group'  => $group,
                'key'    => $validated['key'],
                'locale' => $locale,
            ], [
                'status' => Translation::STATUS_CHANGED,
                'value'  => $value,
            ]);
        }
    }

    /**
     * Get available groups
     *
     * @return Collection
     */
    protected function availableGroups()
    {
        $groups = Translation::select('group');

        if ($excluded = $this->manager->getConfig('exclude_groups')) {
            $groups->whereNotIn('group', $excluded);
        }

        return $groups->groupBy('group')->orderBy('group')
            ->get()->pluck('group', 'group');
    }

    /**
     * Get available locales data
     *
     * @return Collection
     */
    protected function availableLocales()
    {
        $locales = $this->manager->getLocales();

        return collect(config('locales'))
            ->only($locales)
            ->map(function ($data) {
                [$locale, $region] = explode('_', $data['regional']);

                return [
                    'name'   => $data['name'],
                    'region' => strtolower($region),
                    'native' => $data['native'],
                    'locale' => $locale
                ];
            });
    }
}
