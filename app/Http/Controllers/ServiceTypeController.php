<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;
use Exception;
use Illuminate\Http\Request;

class ServiceTypeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    try {
      $serviceTypes = ServiceType::all();
      return response()->json($serviceTypes, 200);
    } catch (Exception $e) {
      return response()->json('Failed to fetch service types', 500);
    }
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string',
      'price' => 'required|numeric',
    ]);

    try {
      $serviceType = ServiceType::create([
        'name' => $validated['name'],
        'price' => $validated['price'],
      ]);

      return response()->json($serviceType, 200);
    } catch (Exception $e) {
      return response()->json('Failed to create service type', 500);
    }
  }
  /**
   * Display the specified resource.
   */
  public function show(ServiceType $serviceType)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateServiceTypeRequest $request, ServiceType $serviceType)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(ServiceType $serviceType)
  {
    //
  }
}
