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
use Carbon\Carbon;

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

    $inventoryDateRaw = $validated['inventory_date'];
    $inventoryCarbonDate = Carbon::parse($inventoryDateRaw);
    $inventoryDateFormatted = $inventoryCarbonDate->format('Y-m-d H:i:s');

    // return response()->json($inventoryDate);

    $vendorId = $validated['inventory_vendor_id'];
    $products = $validated['inventory_products'];

    $updatedRecords = [];
    foreach ($products as $product) {
      $productSku       = $product['product_sku'];
      $updaterId = $product['inventory_updater_id'];
      // $vendorId = $product['inventory_vendor_id'];
      $stockCount = $product['stock_count'];
      $type = $product['type'];
      $inventory = Inventory::where('sku', $productSku)->first();
      if ($type === 'store_in') {
        $inventory->stock_count = $inventory->stock_count + $stockCount;
      }
      if ($type === 'store_out') {
        $inventory->stock_count = $inventory->stock_count - $stockCount;
      }
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


      $inventoryRecord = InventoryRecord::create([
        'inventory_date' => $inventoryDateFormatted,
        'inventory_vendor_id' => $vendorId,
        'inventory_updater_id' => $updaterId,
        'type' => $type,
        'product_sku' => $productSku,
        'quantity' => $stockCount,
        'per_unit_cost' => $buyPrice
      ]);
      $updatedRecords[] = $inventoryRecord;
    }

    // return response()->json(compact('invoice'));
    return response()->json(compact('updatedRecords'));
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
