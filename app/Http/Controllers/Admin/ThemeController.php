<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ThemeController extends Controller
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
     * Set theme mode
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function setMode(Request $request)
    {
        $validated = $this->validate($request, ["value" => "required|in:light,dark"]);
        settings()->theme->put("mode", $validated['value']);
    }

    /**
     * Set theme direction
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function setDirection(Request $request)
    {
        $validated = $this->validate($request, ["value" => "required|in:ltr,rtl"]);
        settings()->theme->put("direction", $validated['value']);
    }

    /**
     * Set theme color
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function setColor(Request $request)
    {
        $validated = $this->validate($request, ["value" => "required|string"]);
        settings()->theme->put("color", $validated['value']);
    }
}
