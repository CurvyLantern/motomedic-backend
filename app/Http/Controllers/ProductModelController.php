<?php

namespace App\Http\Controllers;

use App\Models\ProductModel;
use App\Http\Requests\StoreProductModelRequest;
use App\Http\Requests\UpdateProductModelRequest;
use App\Http\Resources\ProductModelResource;
use App\Models\Brand;

class ProductModelController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $productModels = ProductModel::with('brands')->get();
    return ProductModelResource::collection($productModels);
    return response()->json(compact('productModels'));
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreProductModelRequest $request)
  {
    $validated = $request->validated();

    $names = $validated['names'];
    $brandIds  = $validated['brand_ids'];

    $productModels = [];
    foreach ($names as $name) {
      $productModel = ProductModel::create(['name' => $name]);
      $productModels[] = $productModel;
    }

    if (!empty($brandIds)) {
      // Attaching the product models to the specified brands
      foreach ($brandIds as $brandId) {
        $brand = Brand::find($brandId);
        if ($brand) {
          foreach ($productModels as $productModel) {
            $brand->productModels()->attach($productModel);
          }
        }
      }
    }

    return response()->json(compact('productModels'));
  }

  /**
   * Display the specified resource.
   */
  public function show(ProductModel $productModel)
  {
    return response()->json(compact('productModel'));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateProductModelRequest $request, ProductModel $productModel)
  {
    $validated = $request->validated();

    if (array_key_exists('name', $validated) && !empty($validated['name'])) {
      $name = $validated['name'];
      $productModel->name = $name;
    }
    if (array_key_exists('brand_ids', $validated) && !empty($validated['brand_ids'])) {
      $newBrandIds = $validated['brand_ids'];
      foreach ($newBrandIds as $newBrandId) {
        $brand = Brand::find($newBrandId);
        if ($brand) {
          $productModel->brands()->attach($brand);
        }
      }
    }
    $productModel->save();

    return new ProductModelResource($productModel);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(ProductModel $productModel)
  {
    $productModel->delete();
    return response()->noContent();
  }


  public function productBrandDelete(String $mid, String $bid)
  {
    $productModel = ProductModel::find($mid);
    $productModel->brands()->detach($bid);
    return response()->noContent();
  }
}
