<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Invoice;

use App\Models\Inventory;
use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use App\Http\Resources\InventoryResource;
use App\Models\InventoryRecord;
use App\Models\Price;

class InventoryController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $inventories = Inventory::all();
    return InventoryResource::collection($inventories)->all();
  }

  /**
   * Store a newly created resource in storage.
   */

  public function store(StoreInventoryRequest $request)
  {
    $validated = $request->validated();

    $products = $validated['inventory_products'];

    foreach ($products as $product) {
      $productSku       = $product['product_sku'];
      $inventory = Inventory::where('sku', $productSku)->first();
      $inventory->stock_count = $inventory->stock_count + $product['stock_count'];
      $inventory->save();

      $sellPrice = $product["new_selling_price"];
      $buyPrice = $product["new_buying_price"];
      if (empty($sellPrice) || $sellPrice === 0) {
        $price = Price::where('sku', $productSku)->latest()->first();
        if ($price) {
          $sellPrice = $price->selling_price;
        }
      }

      if (empty($buyPrice) || $buyPrice === 0) {
        $price = Price::where('sku', $productSku)->latest()->first();
        if ($price) {
          $buyPrice = $price->buying_price;
        }
      }

      // Create new price with product sku
      $price = new Price();
      $price->sku = $productSku;
      $price->buying_price = $buyPrice;
      $price->selling_price = $sellPrice;
      $price->save();
    }

    $inventoryRecord = InventoryRecord::create([
      'inventory_vendor_id' => $validated['inventory_vendor_id'],
      'inventory_total_cost' => $validated['inventory_total_cost'],
      'inventory_total_due' => $validated['inventory_total_due'],
      'type' => $validated['type'],
      'purchased_products' => (int)$validated['inventory_products'],
    ]);

    // return response()->json(compact('invoice'));
    return response()->json(compact('inventoryRecord'));
  }

  /**
   * Display the specified resource.
   */
  public function show(Inventory $inventory)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateInventoryRequest $request, Inventory $inventory)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Inventory $inventory)
  {
    //
  }
}
