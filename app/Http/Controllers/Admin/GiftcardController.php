<?php

namespace App\Http\Controllers\Admin;

use Akaunting\Money\Currency;
use Akaunting\Money\Money;
use App\Http\Controllers\Controller;
use App\Http\Resources\GiftcardBrandResource;
use App\Http\Resources\GiftcardContentResource;
use App\Http\Resources\GiftcardResource;
use App\Models\Giftcard;
use App\Models\GiftcardBrand;
use App\Models\GiftcardContent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class GiftcardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_giftcards');
    }

    /**
     * Paginate giftcard
     *
     * @return AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(Giftcard::latest()->withCount('contents'));

        return GiftcardResource::collection($records);
    }

    /**
     * Create giftcard
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function create(Request $request)
    {
        $validated = $this->validateRequest($request);

        Giftcard::create($validated);
    }

    /**
     * Update giftcard
     *
     * @param Request $request
     * @param Giftcard $giftcard
     * @throws ValidationException
     */
    public function update(Request $request, Giftcard $giftcard)
    {
        $validated = $this->validateRequest($request);

        $giftcard->update($validated);
    }

    /**
     * Upload thumbnail
     *
     * @param Request $request
     * @param Giftcard $giftcard
     * @throws ValidationException
     */
    public function uploadThumbnail(Request $request, Giftcard $giftcard)
    {
        $this->validate($request, [
            'file' => 'required|mimetypes:image/png,image/jpeg|dimensions:ratio=1|file|max:100',
        ]);

        $file = $request->file('file');
        $thumbnail = savePublicFile($file, $giftcard->path(), "thumbnail.{$file->extension()}");

        $giftcard->update(['thumbnail' => $thumbnail]);
    }

    /**
     * Giftcard already has a buyer
     *
     * @param Giftcard $giftcard
     * @return mixed|void
     */
    public function delete(Giftcard $giftcard)
    {
        if ($giftcard->contents()->has('buyer')->exists()) {
            return abort(403, trans('giftcard.buyer_exists'));
        }

        $giftcard->delete();
    }

    /**
     * Paginate purchased content
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function purchasedContentPaginate(Request $request)
    {
        $query = GiftcardContent::has('buyer')->latest();

        $this->filterByBuyer($query, $request);

        return GiftcardContentResource::collection(paginate($query));
    }

    /**
     * Filter query by buyer
     *
     * @param Builder $query
     * @param Request $request
     */
    protected function filterByBuyer(Builder $query, Request $request)
    {
        if ($search = $request->get('searchUser')) {
            $query->whereHas('buyer', function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Paginate contents of this giftcard
     *
     * @param Giftcard $giftcard
     * @return AnonymousResourceCollection
     */
    public function contentPaginate(Giftcard $giftcard)
    {
        $records = paginate($giftcard->contents()->doesntHave('buyer')->latest());

        return GiftcardContentResource::collection($records);
    }

    /**
     * @param Request $request
     * @param Giftcard $giftcard
     * @throws ValidationException
     */
    public function createContent(Request $request, Giftcard $giftcard)
    {
        $validated = $this->validate($request, [
            'code'   => 'required|string|max:300',
            'serial' => 'required|string|max:200',
        ]);

        $content = new GiftcardContent();
        $content->serial = $validated['serial'];
        $content->code = $validated['code'];
        $content->giftcard()->associate($giftcard);
        $content->save();
    }

    /**
     * Delete content
     *
     * @param GiftcardContent $content
     * @return void
     */
    public function deleteContent(Giftcard $giftcard, $content)
    {
        $giftcardContent = $giftcard->contents()
            ->doesntHave('buyer')->findOrFail($content);

        $giftcardContent->delete();
    }

    /**
     * Validate request
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    protected function validateRequest(Request $request)
    {
        return $this->validate($request, [
            'title'       => ['required', 'string', 'max:250'],
            'label'       => ['required', 'string', 'max:10'],
            'description' => ['required', 'string', 'max:10000'],
            'instruction' => ['required', 'string', 'max:10000'],
            'value'       => ['required', 'numeric', 'gt:0'],
            'currency'    => ['required', 'exists:supported_currencies,code'],
            'brand_id'    => ['required', 'exists:giftcard_brands,id'],
        ]);
    }

    /**
     * Get brands
     *
     * @return AnonymousResourceCollection
     */
    public function getBrands()
    {
        return GiftcardBrandResource::collection($this->giftcardBrands());
    }

    /**
     * Paginate brand records
     *
     * @return AnonymousResourceCollection
     */
    public function brandPaginate()
    {
        $records = paginate(GiftcardBrand::latest()->withCount('giftcards'));

        return GiftcardBrandResource::collection($records);
    }

    /**
     * Create Giftcard Brand
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function createBrand(Request $request)
    {
        $validated = $this->validate($request, [
            'name'        => ['required', 'string', 'max:250', 'unique:giftcard_brands'],
            'description' => ['required', 'string', 'max:10000'],
        ]);

        GiftcardBrand::create($validated);
    }

    /**
     * Update brand
     *
     * @param Request $request
     * @param GiftcardBrand $brand
     * @throws ValidationException
     */
    public function updateBrand(Request $request, GiftcardBrand $brand)
    {
        $validated = $this->validate($request, [
            'name'        => ['required', 'string', 'max:250', Rule::unique('giftcard_brands')->ignore($brand)],
            'description' => ['required', 'string', 'max:10000'],
        ]);

        $brand->update($validated);
    }

    /**
     * Delete brand
     *
     * @param GiftcardBrand $brand
     * @return mixed|void
     */
    public function deleteBrand(GiftcardBrand $brand)
    {
        if ($brand->giftcards()->has('contents.buyer')->exists()) {
            return abort(403, trans('giftcard.buyer_exists'));
        }
        $brand->delete();
    }

    /**
     * All giftcardBrands
     *
     * @return GiftcardBrand[]|Collection
     */
    protected function giftcardBrands()
    {
        return GiftcardBrand::all();
    }
}
