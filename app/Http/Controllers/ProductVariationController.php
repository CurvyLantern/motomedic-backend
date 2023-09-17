<?php

namespace App\Http\Controllers;

use App\Models\ProductVariation;
use App\Http\Requests\StoreProductVariationRequest;
use App\Http\Requests\UpdateProductVariationRequest;

class ProductVariationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productVariation = ProductVariation::all()->sort('id', 'desc')->forPage(1, 15);
        $context = [
            'productVariation' => $productVariation,
        ];

        return send_response('ProductVariation Data successfully loaded !', $context);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductVariationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariation $productVariation, String $id)
    {
        $productVariation = ProductVariation::find($id);


        if ($productVariation) {
            return send_response('ProductVariation founded !', $productVariation);
        } else {
            return send_error('ProductVariation Not found !!!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductVariationRequest $request, ProductVariation $productVariation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductVariation $productVariation)
    {
        //
    }
}
