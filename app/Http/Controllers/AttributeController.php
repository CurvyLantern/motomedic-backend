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
        $attribute = Attribute::create([
            'name' => $validatedData['name'],
            'priority' => $validatedData['priority'], // Assuming you have 'priority' in your request data
        ]);

        $attributeValues = [];
        foreach ($validatedData['attribute_values'] as $value) {
            $attributeValues[] = new AttributeValue(['name' => $value]);
        }

        $attribute->attributeValues()->saveMany($attributeValues);

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
    public function update(UpdateAttributeRequest $request, Attribute $attribute)
    {
        //
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
