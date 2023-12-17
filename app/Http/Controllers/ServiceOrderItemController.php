<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrderItem;
use App\Http\Requests\StoreServiceOrderItemRequest;
use App\Http\Requests\UpdateServiceOrderItemRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Request;

class ServiceOrderItemController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @param  \App\Models\Order  $order
   * @return \Illuminate\Http\Response
   */
  public function index(Order $order)
  {
    return $order->serviceOrderItems;
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
    $serviceOrderItem = $order->serviceOrderItems()->create($data);
    return $serviceOrderItem;
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Order  $order
   * @param  \App\Models\ServiceOrderItem  $serviceOrderItem
   * @return \Illuminate\Http\Response
   */
  public function show(Order $order, ServiceOrderItem $serviceOrderItem)
  {
    if ($serviceOrderItem->order_id === $order->id) {
      return $serviceOrderItem;
    }
    return response()->json(['error' => 'Service order item not found for this order.'], 404);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Order  $order
   * @param  \App\Models\ServiceOrderItem  $serviceOrderItem
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Order $order, ServiceOrderItem $serviceOrderItem)
  {
    $data = $request->all();
    $serviceOrderItem->update($data);
    return $serviceOrderItem;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Order  $order
   * @param  \App\Models\ServiceOrderItem  $serviceOrderItem
   * @return \Illuminate\Http\Response
   */
  public function destroy(Order $order, ServiceOrderItem $serviceOrderItem)
  {
    $serviceOrderItem->delete();
    return response()->json(['message' => 'Service order item has been deleted.']);
  }
}
