<?php

namespace App\Helpers;

use App\Http\Resources\RequiredDocumentResource;
use App\Http\Resources\UserAddressResource;
use App\Http\Resources\UserDocumentResource;
use App\Models\RequiredDocument;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class UserVerification
{
    /**
     * Basic data
     *
     * @var Collection
     */
    protected $basicData;


    /**
     * Advanced data
     *
     * @var Collection
     */
    protected $advancedData;

    /**
     * Context user
     *
     * @var User
     */
    protected User $user;

    /**
     * Construct verification
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Initialize
     *
     * @param User $user
     * @return static
     */
    public static function make(User $user)
    {
        return new static($user);
    }

    /**
     * Get basic data
     *
     * @return \Illuminate\Support\Collection
     */
    public function basicData()
    {
        if (!isset($this->basicData)) {
            $this->basicData = collect([
                'verified_phone',
                'verified_email',
                'complete_profile'
            ])->filter(function ($name) {
                return settings()->verification->get($name);
            })->map(function ($name) {
                return $this->getData($name);
            })->values();
        }
        return $this->basicData;
    }

    /**
     * Get advanced data
     *
     * @return \Illuminate\Support\Collection
     */
    public function advancedData()
    {
        if (!isset($this->advancedData)) {
            $this->advancedData = collect([
                'verified_address',
                'verified_documents',
            ])->filter(function ($name) {
                return settings()->verification->get($name);
            })->map(function ($name) {
                return $this->getData($name);
            })->values();
        }
        return $this->advancedData;
    }

    /**
     * Get verification data
     *
     * @param $name
     * @return Collection
     */
    protected function getData($name)
    {
        return collect($this->{"get" . Str::studly($name) . "Data"}())
            ->put('name', $name)
            ->put('title', trans("verification.$name"));
    }

    /**
     * Verification status
     *
     * @return string
     */
    public function status()
    {
        $basicStatus = $this->basicData()
            ->reduce(function ($status, $data) {
                return $status && $data->get('verified');
            }, true);

        $advancedStatus = $this->advancedData()
            ->reduce(function ($status, $data) {
                return $status && $data->get('verified');
            }, $basicStatus);

        return $advancedStatus ? 'advanced' :
            ($basicStatus ? 'basic' : 'unverified');
    }

    /**
     * Verified Phone
     *
     * @return array
     */
    protected function getVerifiedPhoneData()
    {
        return [
            'verified' => $this->user->isPhoneVerified()
        ];
    }

    /**
     * Verified Email
     *
     * @return array
     */
    protected function getVerifiedEmailData()
    {
        return [
            'verified' => $this->user->isEmailVerified()
        ];
    }

    /**
     * Complete Profile
     *
     * @return array
     */
    protected function getCompleteProfileData()
    {
        return [
            'verified' => $this->user->profile && $this->user->profile->is_complete
        ];
    }

    /**
     * Verified Documents
     *
     * @return array
     */
    protected function getVerifiedDocumentsData()
    {
        $records = RequiredDocument::enabled()->get()
            ->map(function ($requirement) {
                $document = $requirement->getDocument($this->user);
                return [
                    'verified'    => $document && $document->status == 'approved',
                    'requirement' => RequiredDocumentResource::make($requirement),
                    'document'    => UserDocumentResource::make($document),
                ];
            });

        return [
            'records'  => $records->toArray(),
            'verified' => $records->reduce(function ($status, $document) {
                return $status && $document['verified'];
            }, true),
        ];
    }

    /**
     * Verified Address
     *
     * @return array
     */
    protected function getVerifiedAddressData()
    {
        return [
            'verified' => $this->user->address && $this->user->address->status == 'approved',
            'address'  => UserAddressResource::make($this->user->address)
        ];
    }
}