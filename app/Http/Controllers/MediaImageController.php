<?php

namespace App\Http\Controllers;

use App\Models\MediaImage;
use App\Http\Requests\StoreMediaImageRequest;
use App\Http\Requests\UpdateMediaImageRequest;

class MediaImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMediaImageRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(MediaImage $mediaImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMediaImageRequest $request, MediaImage $mediaImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MediaImage $mediaImage)
    {
        //
    }
}
