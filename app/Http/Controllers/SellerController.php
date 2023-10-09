<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Seller;
use App\Http\Requests\StoreSellerRequest;
use App\Http\Requests\UpdateSellerRequest;
use App\Http\Resources\SellerCollection;
use App\Http\Resources\SellerResource;

class SellerController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $sellers = Seller::orderBy('id', 'asc')->paginate(15);

    return new SellerCollection($sellers);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreSellerRequest $request)
  {
    $validated = $request->validated();

    $seller = Seller::create($validated);

    return new SellerResource($seller);
  }

  /**
   * Display the specified resource.
   */
  public function show(String $id)
  {
    $seller = Seller::whereId($id)->firstOrFail();
    return new SellerResource($seller);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateSellerRequest $request, String $id)
  {
    $validated = $request->validated();

    $seller = Seller::find($id);

    $seller->fill($validated);
    $seller->save();
    return new SellerResource($seller);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(String $id)
  {
    $seller = Seller::find($id);
    if ($seller) {
      $seller->delete();
      return response()->noContent();
    } else {
      return response()->json(['message' => 'Not found'], 404);
    }
  }
}
