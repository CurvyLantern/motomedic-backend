<?php

namespace App\Http\Controllers;

use Exception;

use App\Models\AttributeValue;
use App\Http\Requests\StoreAttributeValueRequest;
use App\Http\Requests\UpdateAttributeValueRequest;

class AttributeValueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attributeValues = AttributeValue::all();

        return $attributeValues;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttributeValueRequest $request)
    {
        $validated = $request->validated();
        if (!$validated) {
            return send_error('validation Failed !!');
        }

        // dd($request->all());

        try {
            $attributeValue = AttributeValue::create([
                'value' => $request->value,
                'attribute_id' => $request->attribute_id,
                'product_id' => $request->product_id,
            ]);
            return send_response("AttributeValue create successfull", $attributeValue);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AttributeValue $attributeValue, String $id)
    {
        $attributeValues = AttributeValue::find($id);


        if ($attributeValues) {
            return send_response('AttributeValue founded !', $attributeValues);
        } else {
            return send_error('AttributeValue Not found !!!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttributeValueRequest $request, String $id)
    {
        $validated = $request->validated();

        // dd($validated['name']);
        if (!$validated) {
            return send_error("Validation Failed");
        }
        try {

            $attributeValue = AttributeValue::find($id);
            if ($attributeValue) {

                $attributeValue->name = $request->name;
                $attributeValue->save();
                return send_response("AttributeValue Update successfully !", $attributeValue);
            } else {
                return send_response('No AttributeValue found !!', []);
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        try {
            $attributeValue = AttributeValue::find($id);

            if ($attributeValue) {
                $attributeValue->delete();
            }
            return send_response("ProductAttribute delete successfully !", []);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }
}
