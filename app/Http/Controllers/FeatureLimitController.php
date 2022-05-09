<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeatureLimitResource;
use App\Models\FeatureLimit;

class FeatureLimitController extends Controller
{
    /**
     * Get all feature limit
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function all()
    {
        return FeatureLimitResource::collection(FeatureLimit::all());
    }
}
