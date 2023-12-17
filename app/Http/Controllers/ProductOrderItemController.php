<?php

namespace App\Http\Controllers;

use App\Models\ProductOrderItem;
use App\Http\Requests\StoreProductOrderItemRequest;
use App\Http\Requests\UpdateProductOrderItemRequest;
use App\Models\Inventory;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class ProductOrderItemController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @param  \App\Models\Order  $order
   * @return \Illuminate\Http\Response
   */
  public function index(Order $order)
  {
    return $order->productOrderItems;
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Order  $order
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request, Order $order)
  {
    $data = $request->all();
    $productOrderItem = $order->productOrderItems()->create($data);
    return $productOrderItem;
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Order  $order
   * @param  \App\Models\ProductOrderItem  $productOrderItem
   * @return \Illuminate\Http\Response
   */
  public function show(Order $order, ProductOrderItem $productOrderItem)
  {
    if ($productOrderItem->order_id === $order->id) {
      return $productOrderItem;
    }
    return response()->json(['error' => 'Product order item not found for this order.'], 404);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Order  $order
   * @param  \App\Models\ProductOrderItem  $productOrderItem
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Order $order, ProductOrderItem $productOrderItem)
  {
    $validatedData = $request->validate([
      'productIncrement' => 'numeric',
      'productDecrement' => 'numeric',
      'discount' => 'numeric',
      'discountType' => 'in:flat,percent'
    ]);
    try {
      DB::beginTransaction();
      $productIncrement = $validatedData['productIncrement'];
      $productDecrement = $validatedData['productDecrement'];
      $oldTotal = $productOrderItem->total_price;
      if ($productDecrement > 0 || $productIncrement > 0) {

        $inventory = Inventory::where('sku', $productOrderItem->product_sku)->first();

        $stockCount = $inventory->stock_count;


        $quantity = $productOrderItem->quantity;
        $newQuantity = max(0, min($stockCount, $quantity + $productIncrement - $productDecrement));
        $difference = $newQuantity - $quantity;
        $inventory->stock_count = $inventory->stock_count - $difference;
        $productOrderItem->quantity = $newQuantity;
        $productOrderItem->total_price = $productOrderItem->quantity * $productOrderItem->unit_price;
        $productOrderItem->save();
        $inventory->save();
      }

      $discount = $validatedData['discount'];
      $discountType = $validatedData['discountType'];
      if ($discount > 0) {
        $productOrderItem->discount = $discount;
        $newTotalPrice = $productOrderItem->quantity * $productOrderItem->unit_price;
        if ($discountType) {
          $productOrderItem->discount_type = $discountType;
        }

        if ($productOrderItem->discount_type === 'flat') {
          $newTotalPrice = max(0, $newTotalPrice - $productOrderItem->discount);
        } else {
          $newTotalPrice = max(0, $newTotalPrice - ($newTotalPrice * $productOrderItem->discount / 100));
        }
        $productOrderItem->total_price = $newTotalPrice;
        $productOrderItem->save();
      }

      $difference = $productOrderItem->total_price - $oldTotal;
      $order->total_price -= $difference;
      $order->save();


      DB::commit();
      // $productOrderItem->update($data);
      return $productOrderItem;
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Order  $order
   * @param  \App\Models\ProductOrderItem  $productOrderItem
   * @return \Illuminate\Http\Response
   */
  public function destroy(Order $order, ProductOrderItem $productOrderItem)
  {
    $productOrderItem->delete();
    return response()->json(['message' => 'Product order item has been deleted.']);
  }
}
