<?php

namespace App\Http\Controllers;

use Exception;
use App\Http\Resources\MechanicResource;
use App\Models\Mechanic;
use App\Http\Requests\StoreMechanicRequest;
use App\Http\Requests\UpdateMechanicRequest;

class MechanicController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $mechanics = Mechanic::orderBy('id', 'asc')->get();

    return MechanicResource::collection($mechanics);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreMechanicRequest $request)
  {
    $validated = $request->validated();
    try {

      $mechanic = Mechanic::create($validated);

      return response()->json(['message' => 'Mechanic created successfully', 'mechanic' => $mechanic]);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(String $id)
  {
    $mechanic = Mechanic::findOrFail($id);

    return response()->json(['mechanic' => $mechanic]);
  }
  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateMechanicRequest $request, String $id)
  {
    $validated = $request->validated();

    $mechanic = Mechanic::findOrFail($id);

    // Validate the fields in the request

    // Use fill to update the mechanic model with validated data
    $mechanic->fill($validated)->save();

    return response()->json(['message' => 'Mechanic updated successfully', 'mechanic' => $mechanic]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy($id)
  {
    $mechanic = Mechanic::findOrFail($id);
    $mechanic->delete();

    return response()->json(['message' => 'Mechanic deleted successfully']);
  }
}
