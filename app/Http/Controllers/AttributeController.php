<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Http\Requests\StoreAttributeRequest;
use App\Http\Requests\UpdateAttributeRequest;
use App\Http\Resources\AttributeResource;
use App\Models\AttributeValue;
use Exception;

class AttributeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $attributes = Attribute::with('attributeValues')->get();

    return AttributeResource::collection($attributes)->all();
    // return AttributeResource::collection($attributes);
    // return AttributeResource::collection($attributes);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAttributeRequest $request)
  {
    $validatedData = $request->validated();

    // Create the attribute with name and priority
    $attribute = Attribute::create([
      'name' => $validatedData['name'],
      'priority' => $validatedData['priority'], // Assuming you have 'priority' in your request data
    ]);

    // Create or update attribute values
    foreach ($validatedData['attribute_values'] as $valueData) {
      $name = $valueData['name'];
      $id = $valueData['id'];

      // Create a new attribute value and associate it with the attribute
      $attributeValue = new AttributeValue(['name' => $name]);
      $attribute->attributeValues()->save($attributeValue);
    }

    return response()->json(['message' => 'Attribute and attribute values created successfully'], 201);
  }
  /**
   * Display the specified resource.
   */
  public function show(Attribute $attribute)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAttributeRequest $request, $id)
  {
    // Validate the incoming request data
    $validatedData = $request->validated();

    // Find the attribute by its ID
    $attribute = Attribute::find($id);

    if (!$attribute) {
      return response()->json(['message' => 'Attribute not found'], 404);
    }

    // Update the attribute name if provided
    if (isset($validatedData['name'])) {
      $attribute->name = $validatedData['name'];
    }

    // Update or create attribute values if provided
    if (isset($validatedData['attribute_values']) && is_array($validatedData['attribute_values'])) {
      foreach ($validatedData['attribute_values'] as $valueData) {
        // Check if 'id' is null or not provided
        if (!isset($valueData['id'])) {
          // If 'id' is null or not provided, create a new attribute value
          $newAttributeValue = new AttributeValue(['name' => $valueData['name']]);
          $attribute->attributeValues()->save($newAttributeValue);
        } else {
          // 'id' is provided, find and update the attribute value
          $existingAttributeValue = AttributeValue::find($valueData['id']);

          if ($existingAttributeValue) {
            $existingAttributeValue->name = $valueData['name'];
            $existingAttributeValue->save();
          }
        }
      }
    }

    // Save the changes to the attribute
    $attribute->save();

    return response()->json(['message' => 'Attribute updated successfully', 'data' => new AttributeResource($attribute)]);
  }



  /**
   * Remove the specified resource from storage.
   */
  public function destroy(String $id)
  {
    try {
      $attribute = Attribute::find($id);
      if ($attribute) {
        $attribute->delete();
        return response()->noContent();
      } else {
        return response()->isNotFound();
      }
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }
}
