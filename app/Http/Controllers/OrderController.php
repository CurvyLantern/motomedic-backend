<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Service;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderCollection;
use Exception;
use Illuminate\Support\Facades\DB;
use App\Models\OrderItem;
use App\Models\ProductVariation;
use Illuminate\Http\Request;

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

  public function apiCreatePage()
  {

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


  // $orders = Order::where('status', $statusFromQuery)
  //   ->with('customer')
  //   ->with(['orderItems' => function ($query) {
  //     $query->where('type', 'product')->with('product');
  //     $query->orWhere('type', 'service')->with('service');
  //   }, 'customer'])
  //   ->get();
  // ===========
  // ===========
  // $orders = Order::where('status', $statusFromQuery)
  //   ->with('customer')
  //   ->with(['orderItems' => function ($query) {
  //     $query->with(['product' => function ($productQuery) {
  //       $productQuery->where('type', 'product');
  //     }, 'service' => function ($serviceQuery) {
  //       $serviceQuery->where('type', 'service');
  //     }]);
  //   }])
  //   ->get();


  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $statusFromQuery = $request->query('status', '');
    if ($statusFromQuery !== '') {


      $orders = Order::where('status', $statusFromQuery)
        ->with('customer')
        ->with(['orderItems' => function ($query) {
          $query->whereNotNull('product_id')->with('product');
          $query->orWhereNotNull('service_id')->with('service');
        }])
        ->get();
      return OrderResource::collection($orders);
    } else {
      $orders = Order::orderBy('id', 'asc')->with('customer')->with('orderItems')->paginate(15);
      return new OrderCollection($orders);
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

    $validatedData = $request->validated();
    // Begin a database transaction

    DB::beginTransaction();

    try {
      // Create the order
      $order = Order::create([
        'customer_id' => $validatedData["customer_id"],
        'total' => $validatedData["total"],
        'discount' => $validatedData["discount"],
        'tax' => $validatedData["tax"],
        'note' => $validatedData["note"],
        'status' => $validatedData["status"],
      ]);


      // temp test 1

      // Calculate the total for the order
      // $totalOrderPrice = 0;



      foreach ($validatedData['items'] as $itemData) {
        // $totalOrderPrice += $itemData['total_price'];

        // update inventory
        if ($validatedData['type'] === 'product') {
          $product = Product::where('sku', $itemData['sku'])->first();
          $inventory = null;
          if ($product) {
            $inventory = $product->inventory;
          } else {
            $productVariation = ProductVariation::where('sku', $itemData['sku'])->first();
            if ($productVariation) {
              $inventory = $productVariation->inventory;
            }
          }
          if ($inventory && $inventory->stock_count >= $itemData['quantity']) {
            $inventory->stock_count -= $itemData['quantity'];
            $inventory->save();
          } else {
            // Rollback the transaction and return an error response
            DB::rollBack();
            return response()->json(['message' => 'Insufficient stock for the product'], 400);
          }
        }

        // Create the order item
        $orderItem = OrderItem::create([
          'order_id' => $order->id,
          'product_id' => ($validatedData['type'] === 'product') ? $itemData['product_id'] : null,
          'variation_id' => ($validatedData['type'] === 'product') ? $itemData['product_variation_id'] : null,
          'service_id' => ($validatedData['type'] === 'service') ? $itemData['service_id'] : null,
          'quantity' => $itemData['quantity'],
          'total_price' => $itemData['total_price'],
          'unit_price' => $itemData['unit_price'],
          'type' => $validatedData['type']
        ]);
      }

      // DB::rollBack();
      // return response()->json(compact('order', 'validatedData'));








      // Update the order's total
      // $order->total = $totalOrderPrice;
      // $order->save();

      // Commit the database transaction
      DB::commit();

      // Return a success response or redirect as needed
      return response()->json(['message' => 'Order created successfully']);
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => 'Order creation failed'], 500);
    }
    return ['why' => 'code should not reach here'];
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateOrderRequest $request, String $id)
  {
    $validated = $request->validated();
    try {
      $order = Order::find($id);
      $order->fill($request->all());
      // $order->customerId = $request->customerId;
      // $order->customer_id = $request->customer_id;
      // $order->total = $request->total;
      // $order->discount = $request->discount;
      // $order->tax = $request->tax;
      // $order->note = $request->note;
      // $order->status = $request->status;

      $order->save();

      return send_response("Order Updated successfully !", $order);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
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









// .................... Dump code ...............


// [


//             // foreach ($orderItemCreate as $itemData) {
//             //     $orderItem = $order->orderItems()->create($itemData);

//             //     $product = Product::where('id', $request->product_id)->get();
//             //     $productPrice = $product->first()->price;
//             //     $service = Service::where('id', $request->service_id)->get();
//             //     $servicePrice = $service->first()->price;


//             //     $order->increment('total', $productPrice * $orderItem->quantity + $servicePrice);
//             // }
// ]

// [

//     // 'price' => $service->first()->price + $product->first()->price * $request->quantity,
// ]


// [


//                 // $orderItem = $order->orderItems()->create([
//                 //     'order_id' => $itemData['order_id'],
//                 //     'service_id' => $itemData['service_id'],
//                 //     'product_id' => $itemData['product_id'],
//                 //     'quantity' => $itemData['quantity'],
//                 // ]);

//                 // $order->increment('total', $productPrice * $orderItem->quantity + $servicePrice);

// ]



// [
//     //  .................. create order .............

//             // $service = Service::where('id', $request->service_id)->get();

//             // $serviceOrderItems = [
//             //     [
//             //         'order_id' => $order->id,
//             //         'service_id' => $request->service_id,
//             //         'quantity' => $request->quantity,
//             //         'price' => $service->first()->price,
//             //     ]
//             // ];
//             // $product = Product::where('id', $request->product_id)->get();
//             // $productOrderItems = [
//             //     [
//             //         'order_id' => $order->id,
//             //         'product_id' => $request->product_id, // Replace with the product's ID
//             //         'quantity' => $request->quantity,
//             //         'price' => $product->first()->price,
//             //     ]
//             // ];

//             // Create order items and calculate the total amount
//             //            $orderItems = [
//             //                $serviceOrderItems,
//             //                $productOrderItems,
//             //            ];

//             // foreach ($serviceOrderItems as $serviceData) {
//             //     $orderItem = $order->orderItems()->create($serviceData);
//             //     $service = Service::where('id', $request->service_id)->get();
//             //     $servicePrice = $service->first()->price;
//             //     $order->increment('total', $servicePrice);
//             // }

//             // foreach ($productOrderItems as $productData) {
//             //     //                $orderItem = $order->orderItems()->create($productData);
//             //     $orderItem = $order->orderItems()->create([
//             //         'order_id' => $order->id,
//             //         'product_id' => $request->product_id, // Replace with the product's ID
//             //         'quantity' => $request->quantity,
//             //         'price' => $product->first()->price,
//             //     ]);
//             //     $product = Product::where('id', $request->product_id)->get();
//             //     $productPrice = $product->first()->price;
//             // $order->increment('total', $productPrice * $orderItem->quantity);
//             // }


//             //  .................. end create order .............
// ]

// [

//             //            foreach ($orderItems as $orderItemData) {
//             //                $orderItem = $order->orderItems()->create($orderItemData);
//             //
//             //                $productPrice =0;
//             //                $product = Product::where('id', $orderItemData->product_id)->get();
//             //                $productPrice = $product->first()->price;
//             //
//             //                $servicePrice =0;
//             //                $service = Service::where('id', $orderItemData->service_id)->get();
//             //                $servicePrice = $service->first()->price;
//             //
//             //                // Calculate and update the total amount for the order
//             //                $order->increment('price', $productPrice * $orderItem->quantity) + $servicePrice;
//             //            }
//             //
//             //            $order->update([
//             //                'total' => $order->total->sum('total'),
//             //            ]);
// ]
