<?php

namespace App\Http\Controllers;

use App\Models\ProductOrderItem;
use App\Http\Requests\StoreProductOrderItemRequest;
use App\Http\Requests\UpdateProductOrderItemRequest;

class ProductOrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductOrderItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductOrderItem $productOrderItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductOrderItemRequest $request, ProductOrderItem $productOrderItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductOrderItem $productOrderItem)
    {
        //
    }
}
