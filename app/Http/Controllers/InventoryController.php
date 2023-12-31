<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Invoice;

use App\Models\Inventory;
use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use App\Http\Resources\InventoryResource;
use App\Models\InventoryRecord;

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
      $inventory = Inventory::where('sku', $product['product_sku'])->first();
      $inventory->stock_count = $inventory->stock_count + $product['stock_count'];
      $inventory->save();
    }

    // FIXME : Why isn't Invoice table available??
    $invoice = InventoryRecord::create([
      'inventory_seller_id' => $validated['inventory_seller_id'],
      'inventory_total_cost' => $validated['inventory_total_cost'],
      'inventory_total_due' => $validated['inventory_total_due'],
      'type' => $validated['type'],
      'purchased_products' => (int)$validated['inventory_products'],
    ]);

    // return response()->json(compact('invoice'));
    return response()->noContent();
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
