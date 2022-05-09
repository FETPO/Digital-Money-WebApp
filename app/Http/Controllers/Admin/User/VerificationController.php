<?php

namespace App\Http\Controllers\Admin\User;

use App\Helpers\FileVault;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserAddressResource;
use App\Http\Resources\UserDocumentResource;
use App\Models\UserAddress;
use App\Models\UserDocument;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:verify_users');
    }

    /**
     * Get paginated address
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function addressPaginate(Request $request)
    {
        $query = UserAddress::with('user')->latest();

        $this->filterByUser($query, $request);

        return UserAddressResource::collection(paginate($query));
    }

    /**
     * Approve address
     *
     * @param UserAddress $address
     */
    public function approveAddress(UserAddress $address)
    {
        if ($address->status === "pending") {
            $address->update(['status' => 'approved']);
        }
    }

    /**
     * Reject address
     *
     * @param UserAddress $address
     */
    public function rejectAddress(UserAddress $address)
    {
        $address->update(['status' => 'rejected']);
    }

    /**
     * Download document
     *
     * @param UserDocument $document
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function downloadDocument(UserDocument $document)
    {
        $data = collect($document->data);

        $content = FileVault::decrypt($path = $data->get('path'));

        $name = pathinfo($path, PATHINFO_FILENAME);

        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, "$name.{$data->get('extension')}", [
            'Content-Type' => $data->get('mimeType'),
        ]);
    }

    /**
     * Approve document
     *
     * @param UserDocument $document
     */
    public function approveDocument(UserDocument $document)
    {
        if ($document->status === "pending") {
            $document->update(['status' => 'approved']);
        }
    }

    /**
     * Reject document
     *
     * @param UserDocument $document
     */
    public function rejectDocument(UserDocument $document)
    {
        $document->update(['status' => 'rejected']);
    }

    /**
     * Get paginated document
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function documentPaginate(Request $request)
    {
        $query = UserDocument::with(['user', 'requirement'])
            ->whereHas('requirement', function (Builder $query) {
                $query->where('status', true);
            })->latest();

        $this->filterByUser($query, $request);

        return UserDocumentResource::collection(paginate($query));
    }

    /**
     * Filter query by user
     *
     * @param Builder $query
     * @param Request $request
     */
    protected function filterByUser(Builder $query, Request $request)
    {
        if ($search = $request->get('searchUser')) {
            $query->whereHas('user', function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }
    }
}
