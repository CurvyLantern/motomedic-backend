<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Service;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use Exception;

class OrderController extends Controller
{
    public function apiTest()
    {
        $orders = Order::orderBy('id', 'asc')->get();

        $context = [
            'orders' => $orders,
        ];
        //        return send_response('Products Data successfully loaded !', $context);

        return view('apiTest', compact('context'));
    }

    public function apiCreatePage(){

        // all product data .........

        $products = Product::all();


        // all customer data ......

        $customers = Customer::all();

        // all service data ......

        $services = Service::all();

        $context = [
          'products' => $products,
          'customers' => $customers,
          'services' => $services,
        ];
        return view('apiCreate', compact('context'));
    }





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
        return OrderResource::collection($context);
    }


    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        try {
            $orders = Order::find($id);
            if ($orders) {

                $customer = Customer::where('id', $orders->customer_id)->first();
                if ($orders) {
                    $context = [
                        'orders' => $orders,
                        'customer' => $customer,
                    ];
                    return OrderResource::collection($context);
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
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {

        $validated = $request->validated();

//        dd($validated);
        try {
            $discount = 0;
            $tax = 0;
            $order = Order::create([
                'customer_id' => $request->customer_id,
                'total' => 0,
                'discount' => $discount,
                'tax' => $tax,
                'note' => $request->note,
                'status' => $request->status,
            ]);
//            return send_response('order Create Successfull ',$order);

            //....................... Order Item Create ....................

//            $product = Product::where('id', $request->product_id)->get();
//            $service = Service::where ('id',$request->service_id)->get();
//
//            $orderItemCreate = [
//              [
//                  'order_id' => $order->id,
//                  'service_id' => $request->service_id,
//                  'product_id' => $request->product_id,
//                  'quantity' => $request->quantity,
//                  'price' => $service->first()->price + $product->first()->price * $request->quantity ,
//              ]
//            ];
//
//            foreach ($orderItemCreate as $itemData){
//                $orderItem = $order->orderItems()->create($itemData);
//
//                $product = Product::where('id', $request->product_id)->get();
//                $productPrice = $product->first()->price;
//                $service = Service::where('id', $request->service_id)->get();
//                $servicePrice = $service->first()->price;
//
//
//                $order->increment('total', $productPrice * $orderItem->quantity + $servicePrice);
//            }

            //....................... Order Item Create ends....................

            $service = Service::where ('id',$request->service_id)->get();

            $serviceOrderItems = [
                [
                    'order_id' => $order->id,
                    'service_id' => $request->service_id,
                    'quantity' => $request->quantity,
                    'price' => $service->first()->price,
                ]
            ];
            $product = Product::where('id', $request->product_id)->get();
            $productOrderItems = [
                [
                    'order_id' => $order->id,
                    'product_id' => $request->product_id, // Replace with the product's ID
                    'quantity' => $request->quantity,
                    'price' => $product->first()->price,
                ]
            ];

            // Create order items and calculate the total amount
//            $orderItems = [
//                $serviceOrderItems,
//                $productOrderItems,
//            ];

            foreach ($serviceOrderItems as $serviceData){
                $orderItem = $order->orderItems()->create($serviceData);
                $service = Service::where('id', $request->service_id)->get();
                $servicePrice = $service->first()->price;
                $order->increment('total', $servicePrice);
            }

            foreach ($productOrderItems as $productData){
//                $orderItem = $order->orderItems()->create($productData);
                $orderItem = $order->orderItems()->create([
                    'order_id' => $order->id,
                    'product_id' => $request->product_id, // Replace with the product's ID
                    'quantity' => $request->quantity,
                    'price' => $product->first()->price,
                ]);
                $product = Product::where('id', $request->product_id)->get();
                $productPrice = $product->first()->price;
                $order->increment('total', $productPrice * $orderItem->quantity);
            }

//            foreach ($orderItems as $orderItemData) {
//                $orderItem = $order->orderItems()->create($orderItemData);
//
//                $productPrice =0;
//                $product = Product::where('id', $orderItemData->product_id)->get();
//                $productPrice = $product->first()->price;
//
//                $servicePrice =0;
//                $service = Service::where('id', $orderItemData->service_id)->get();
//                $servicePrice = $service->first()->price;
//
//                // Calculate and update the total amount for the order
//                $order->increment('price', $productPrice * $orderItem->quantity) + $servicePrice;
//            }
//
//            $order->update([
//                'total' => $order->total->sum('total'),
//            ]);

            $context = [
                'order' => $order,

            ];
            return send_response('Order Create Successfully', OrderResource::collection($context));
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, String $id)
    {
        $validated = $request->validated();
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
