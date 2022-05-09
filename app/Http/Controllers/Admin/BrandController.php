<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BrandController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_customization');
    }

    /**
     * Update social links
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateSocialLinks(Request $request)
    {
        $validated = $this->validate($request, [
            'support_url' => 'required|url',
            'terms_url'   => 'required|url',
            'policy_url'  => 'required|url',
        ]);

        foreach ($validated as $key => $value) {
            settings()->brand->put($key, $value);
        }
    }

    /**
     * Upload logo
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function uploadLogo(Request $request)
    {
        $dimensions = Rule::dimensions()->maxWidth(100)->ratio(1);

        $this->validate($request, [
            'file' => ['required', 'mimetypes:image/png', 'file', 'max:50', $dimensions]
        ]);

        $this->save($request->file('file'), "logo_url", "logo");
    }

    /**
     * Upload favicon
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function uploadFavicon(Request $request)
    {
        $dimensions = Rule::dimensions()->maxWidth(32)->ratio(1);

        $this->validate($request, [
            'file' => ['required', 'mimetypes:image/png', 'file', 'max:10', $dimensions]
        ]);

        $this->save($request->file('file'), "favicon_url", "favicon");
    }

    /**
     * Save asset
     *
     * @param UploadedFile $file
     * @param $key
     * @param $name
     */
    protected function save(UploadedFile $file, $key, $name)
    {
        $name = "$name.{$file->extension()}";
        $url = savePublicFile($file, "assets", $name);
        settings()->brand->put($key, url($url));
    }

    /**
     * Get unique hash
     *
     * @return string
     */
    protected function hash()
    {
        return Str::random(5);
    }
}
