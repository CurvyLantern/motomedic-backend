<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Service;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use Exception;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::orderBy('id', 'asc')->paginate(15);
        // $products = $orders->products()->where('id','productId');

        $context = [
            'orders' => $orders,
            // 'products' => $products,
        ];
        return send_response('Products Data successfully loaded !', $context);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $validator = $request->validate();

        // if ($validator->fails()) {
        //     return send_error('Data validation Failed !!', $validator->errors(), 422);
        // }

        try {

            $i = 20;


            $order = Order::create([
                'customerId' => $request->customerId,
                'serviceId' => $request->serviveId,
                // 'productId'=> $request->productId,
                'quantity' => $request->quantity,
                'subtotal' => $request->subtotal,
                'total' => $request->total,
                'tax' => $request->tax,
                'discount' => $request->discount,
                'note' => $request->note,
                'extra' => $request->extra,
                'serviceStatus' => $request->serviceStatus,
                'queue' => $i,
                'orderCreator' => $request->orderCreator,
                // foreach($request->productId as $key => $product){
                //         'productId' = $product->productId;
                // }

            ]);

            $queue = $order->queues()->create([
                'arriveDateTime' => $request->arriveDateTime,
                'departDateTime' => $request->departDateTime,
                'orderId' => $order->id,
                'serviceId' => $order->serviceId,
                'staffId' => $request->staffId,
            ]);

            $queue = $i++;

            $context = [
                'order' => $order,
            ];
            return send_response('Order Create Successfully', $context);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        try {
            $orders = Order::find($id);
            if ($orders) {

                $customer = Customer::where('id', $orders->customerId)->get();
                $products = Product::where('id', $orders->productId)->get();
                $service = Service::where('id', $orders->serviceId)->get();
                if ($orders) {
                    $context = [
                        'orders' => $orders,
                        'products' => $products,
                        'customer' => $customer,
                        'service' => $service,
                    ];
                    return send_response('Orders founded !', $context);
                } else {
                    return send_error('Orders Not found !!!');
                }
            } else {
                return send_error('Order Not Found !!!!!');
            }
        } catch (Exception $e) {

            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, String $id)
    {
        $validator = $request->validate();
        // if ($validator->fails()) {
        //     return send_error('Data validation Failed !!', $validator->errors(), 422);
        // }

        try {

            $order = Order::find($id);


            // $order->customerId = $request->customerId;
            $order->serviceId = $request->serviveId;
            $order->productId = $request->productId;
            $order->quantity = $request->quantity;
            $order->subtotal = $request->subtotal;
            $order->total = $request->total;
            $order->tax = $request->tax;
            $order->discount = $request->discount;
            $order->note = $request->note;
            $order->extra = $request->extra;
            $order->serviceStatus = $request->serviceStatus;
            $order->queue = $request->queue;

            $order->save();

            $context = [
                'order' => $order,
            ];
            return send_response("Order Update successfully !", $context);
        } catch (Exception $e) {
            return send_error("Order data update failed !!!");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        try {
            $orders = Order::find($id);
            if ($orders) {
                $orders->delete();
                return send_response('Order Deleted successfully', []);
            } else {
                return send_error('Order Not Found !!!');
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }
}
