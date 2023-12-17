<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;
use App\Http\Resources\ServiceTypeResource;
use App\Models\ServiceTypeProduct;
use Exception;
use Illuminate\Http\Request;

class ServiceTypeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $serviceTypes = ServiceType::with('serviceTypeProducts')->get();
    return ServiceTypeResource::collection($serviceTypes);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreServiceTypeRequest $request)
  {
    $validated = $request->validated();
    $serviceType = ServiceType::create($validated);

    $products = $validated['service_products'];
    foreach ($products as $product) {
      $serviceType->serviceTypeProducts()->create($product);
    }

    $serviceType->load(['serviceTypeProducts']);
    return new ServiceTypeResource($serviceType);
  }
  /**
   * Display the specified resource.
   */
  public function show(ServiceType $serviceType)
  {
    return new ServiceTypeResource($serviceType);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateServiceTypeRequest $request, String $id)
  {
    $validated = $request->validated();
    $serviceType = ServiceType::findOrFail($id);
    $serviceType->fill($validated);
    $serviceType->save();
    return response()->json(compact('validated'));
    return new ServiceTypeResource($serviceType);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(ServiceType $serviceType)
  {
    $serviceType->delete();
    return response()->noContent();
  }
}
