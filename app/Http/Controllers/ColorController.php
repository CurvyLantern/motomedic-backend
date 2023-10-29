<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Http\Requests\StoreColorRequest;
use App\Http\Requests\UpdateColorRequest;
use App\Http\Resources\ColorResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class ColorController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $colors = Color::orderBy('id', 'asc')->get();

    return ColorResource::collection($colors);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreColorRequest $request)
  {
    $validated = $request->validated();


    try {
      $color = Color::create($validated);
      return new ColorResource($color);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(Color $color)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateColorRequest $request, Color $color)
  {
    $validated = $request->validated();
    $color->fill($validated);
    $color->save();
    return response()->json(compact('color'));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Color $color)
  {
    if ($color) {
      $color->delete();
    }
    return response()->noContent();
  }
}
