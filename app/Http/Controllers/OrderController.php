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
use GuzzleHttp\Psr7\Request;

class OrderController extends Controller
{
    public function apipage()
    {
        $orders = Order::orderBy('id', 'asc')->get();

        $context = [
            'orders' => $orders,
        ];
        //        return send_response('Products Data successfully loaded !', $context);

        return view('apitest', compact('context'));
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
        try {
            $discount = 0;
            $tax = 0;
            $order = Order::create([
                'customer_id' => $validated->customer_id,
                'total' => 0,
                'discount' => $discount,
                'tax' => $tax,
                'note' => $validated->note,
                'status' => $validated->status,
            ]);

            $serviceOrderItems = [
                [
                    'order_id' => $order->id,
                    'service_id' => $request->service_id, // Replace with the service's ID
                    'quantity' => $request->quantity,
                    'price' => $request->price,
                ],
            ];

            $productOrderItems = [
                [
                    'order_id' => $order->id,
                    'product_id' => $request->product_id, // Replace with the product's ID
                    'quantity' => $request->quantity,
                    'price' => $request->price,
                ],
            ];

            // Create order items and calculate the total amount
            $orderItems = array_merge($productOrderItems, $serviceOrderItems);

            foreach ($orderItems as $orderItemData) {
                $orderItem = $order->orderItems()->create($orderItemData);

                $product = Product::where('id', $orderItem->product_id)->firts();
                $productPrice = $product->price;

                $service = Service::where('id', $orderItem->service_id)->first();
                $servicePrice = $service->price;

                // Calculate and update the total amount for the order
                $order->increment('price', $productPrice * $orderItem->quantity) + $servicePrice;
            }

            $order->update([
                'total' => $order->total->sum('price'),
            ]);

            $context = [
                'order' => $order,
            ];
            return send_response('Order Create Successfully', OrderResource::collection($context));
            //            // Create order items for services
            //            $serviceOrderItems = $order->orderItems()->create([
            //                'order_id' => $order->id,
            //                'service_id' => $request->service_id, // Replace with the service's ID
            //                'quantity' => $request->quantity,
            //                'price' => $request->price,
            //            ]);
            //
            //            // Create order items for products
            //            $productProductItems = $order->orderItems()->create([
            //                'order_id' => $order->id,
            //                'product_id' => $request->product_id, // Replace with the product's ID
            //                'quantity' => $request->quantity,
            //                'price' => $request->price,
            //            ]);
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
