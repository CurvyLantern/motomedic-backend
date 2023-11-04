<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Http\Resources\VendorCollection;
use App\Http\Resources\VendorResource;

class VendorController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $sellers = Vendor::orderBy('id', 'asc')->paginate(15);

    return new VendorCollection($sellers);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreVendorRequest $request)
  {
    $validated = $request->validated();

    $vendor = Vendor::create($validated);

    return new VendorResource($vendor);
  }

  /**
   * Display the specified resource.
   */
  public function show(String $id)
  {
    $vendor = Vendor::whereId($id)->firstOrFail();
    return new VendorResource($vendor);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateVendorRequest $request, String $id)
  {
    $validated = $request->validated();

    $vendor = Vendor::find($id);

    $vendor->fill($validated);
    $vendor->save();
    return new VendorResource($vendor);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(String $id)
  {
    $vendor = Vendor::find($id);
    if ($vendor) {
      $vendor->delete();
      return response()->noContent();
    } else {
      return response()->json(['message' => 'Not found'], 404);
    }
  }
}
