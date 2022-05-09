<?php

namespace App\Http\Controllers\User;

use App\Helpers\FileVault;
use App\Http\Controllers\Controller;
use App\Models\RequiredDocument;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    /**
     * Get verification data
     *
     * @return array
     */
    public function get()
    {
        return [
            'basic'    => Auth::user()->verification()->basicData(),
            'advanced' => Auth::user()->verification()->advancedData(),
            'status'   => Auth::user()->verification()->status(),
        ];
    }

    /**
     * Update user address
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateAddress(Request $request)
    {
        $address = Auth::user()->address()->firstOrNew();

        if ($address->status == "approved") {
            abort(403, trans("common.forbidden"));
        }

        $data = $this->validate($request, [
            'address'  => 'required|string|max:1000',
            'unit'     => 'required|string|max:200',
            'city'     => 'required|string|max:200',
            'postcode' => 'required|string|max:200',
            'state'    => 'required|string|max:200',
        ]);

        $address->status = "pending";

        $address->fill($data)->save();
    }

    /**
     * Upload document
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function uploadDocument(Request $request)
    {
        Auth::user()->acquireLock(function (User $user) use ($request) {
            $requirement = RequiredDocument::enabled()
                ->findOrFail($request->get('requirement'));

            $existing = $requirement->getDocument($user);

            if ($existing && $existing->status !== 'rejected') {
                abort(403, trans('verification.information_pending'));
            }

            $document = new UserDocument();
            $document->data = $this->processFile($request);
            $document->requirement()->associate($requirement);
            $user->documents()->save($document);
        });
    }

    /**
     * Process file data
     *
     * @param Request $request
     * @return array
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function processFile(Request $request)
    {
        $this->validate($request, [
            'data' => 'required|file|mimes:png,jpeg,doc,docx,pdf|max:5120'
        ]);

        $file = $request->file('data');

        return [
            'extension' => $file->clientExtension(),
            'path'      => FileVault::encrypt($file->get()),
            'mimeType'  => $file->getMimeType(),
        ];
    }
}
