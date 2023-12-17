<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateServiceRequest;
use App\Http\Requests\OrderPosConfirmAndPrintRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Service;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderCollection;
use App\Models\Inventory;
use App\Models\Mechanic;
use Exception;
use Illuminate\Support\Facades\DB;
use App\Models\OrderItem;
use App\Models\ProductOrderItem;
use App\Models\ProductVariation;
use App\Models\ServiceOrderItem;
use App\Models\ServiceOrderMechanic;
use App\Models\ServiceType;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;

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
    $paymentStatusFromQuery = $request->query('paymentStatus', '');

    $timeStatusFromQuery = $request->query('timeStatus', '');
    $customerIdFromQuery = $request->query('customer_id', '');
    $query = Order::query();
    if ($paymentStatusFromQuery !== '') {
      $query->where('payment_status', $paymentStatusFromQuery);
    }
    if ($customerIdFromQuery !== '') {
      $query->where('customer_id', $customerIdFromQuery);
    }
    if ($timeStatusFromQuery) {
      $query->where('time_status', $timeStatusFromQuery);
    }

    $orders = $query->with(['customer', 'seller', 'serviceOrderItems', 'productOrderItems'])->paginate();


    return new OrderCollection($orders);
    // if ($statusFromQuery !== '') {


    //   $orders = Order::where('status', $statusFromQuery)
    //     ->with('customer')
    //     ->with(['orderItems' => function ($query) {
    //       $query->whereNotNull('product_id')->with('product');
    //       $query->orWhereNotNull('service_id')->with('service');
    //     }])
    //     ->get();
    //   return OrderResource::collection($orders);
    // } else {
    //   $orders = Order::orderBy('id', 'asc')->with('customer')->with('orderItems')->paginate(15);
    //   return new OrderCollection($orders);
    // }
  }


  /**
   * Display the specified resource.
   */
  public function show(String $id)
  {
    $order = Order::with(['customer', 'seller', 'productOrderItems', 'serviceOrderItems', 'serviceOrderItems.serviceType'])->where('id', $id)->first();

    return new OrderResource($order);
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

  public function waitingServices()
  {
    $orders = Order::with('customer', 'seller', 'serviceOrderItems', 'productOrderItems')->where('time_status', 'waiting')->get();
    return OrderResource::collection($orders);
  }

  public function confirmAndPrint(OrderPosConfirmAndPrintRequest $request)
  {
    $validatedData = $request->validated();
    // Begin a database transaction

    // return $validatedData;

    DB::beginTransaction();

    try {
      // Create the order
      $sellerId = $validatedData['seller_id'];
      $order = Order::create([
        'customer_id' => $validatedData["customer_id"],
        'note' => $validatedData["note"],
        'status' => $validatedData["status"],
        'seller_id' => $sellerId,
      ]);



      $orderTotalPrice = 0;
      $items = $validatedData['items'];
      $tempArr = [];
      foreach ($items as $itemData) {
        // $totalOrderPrice += $itemData['total_price'];
        $productSku = $itemData['product_sku'];
        $quantity = $itemData['quantity'];
        $unitPrice = $itemData['unit_price'];
        $flatTypeDiscount = $itemData['discountType'] === 'flat';
        $discountAmount = $itemData['discount'];
        $totalPrice = $quantity * $unitPrice;
        if ($flatTypeDiscount) {
          $totalPrice = $totalPrice - $discountAmount;
        } else {
          $totalPrice = $totalPrice - ($totalPrice * $discountAmount / 100);
        }

        $orderTotalPrice = $orderTotalPrice + $totalPrice;


        $product = Product::where('sku', $productSku)->first();
        $inventory = null;
        if ($product) {
          $inventory = $product->inventory;
        } else {
          $productVariation = ProductVariation::where('sku', $productSku)->first();
          if ($productVariation) {
            $inventory = $productVariation->inventory;
          }
        }

        if ($inventory && $inventory->stock_count >= $quantity) {
          $inventory->stock_count -= $quantity;
          $inventory->save();
        } else {
          // Rollback the transaction and return an error response
          DB::rollBack();
          return response()->json(['message' => 'Insufficient stock for the product'], 400);
        }



        // Create the order item
        $productOrderItemData = [
          // 'order_id' => $order->id,
          'product_sku' => $productSku,
          'type' => $itemData['type'],
          'seller_id' => $sellerId,
          'status' => $itemData['status'],
          'quantity' => $quantity,
          'total_price' => $totalPrice,
          'unit_price' => $unitPrice,
          'discount' => $discountAmount,
          'discount_type' => $itemData['discountType'],
        ];
        $tempArr[] = $productOrderItemData;
        $order->productOrderItems()->create($productOrderItemData);
        // ProductOrderItem::create();
      }




      $orderDiscount = $validatedData['overallDiscountAmount'];
      $orderDiscountType = $validatedData['overallDiscountType'];
      $isDiscountFlat = $orderDiscountType === 'flat';
      if ($isDiscountFlat) {
        $orderTotalPrice = $orderTotalPrice - $orderDiscount;
      } else {
        $orderTotalPrice = $orderTotalPrice - ($orderTotalPrice * $orderDiscount / 100);
      }
      $orderTaxType = $validatedData['taxType'];
      $isTaxFlat = $orderTaxType === 'flat';
      $orderTax = $validatedData['taxAmount'];
      if ($isTaxFlat) {
        $orderTotalPrice = $orderTotalPrice - $orderTax;
      } else {
        $orderTotalPrice = $orderTotalPrice - ($orderTotalPrice * $orderTax / 100);
      }


      $order->total_price = $orderTotalPrice;
      $order->overall_discount = $orderDiscount;
      $order->overall_discount_type = $orderDiscountType;
      $order->overall_tax = $orderTax;
      $order->overall_tax_type = $orderTaxType;

      $order->save();

      $order->load(['customer', 'seller', 'productOrderItems']);

      // DB::rollBack();

      // return $orderDiscount;



      // Commit the database transaction
      DB::commit();

      // Return a success response or redirect as needed
      return new OrderResource($order);
      return response()->json(['message' => 'Order created successfully']);
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => 'Order creation failed'], 500);
    }
  }

  public function addProductOrders(Request $request, String $orderId)
  {
    $order = Order::findOrfail($orderId);
    $validatedData = $request->validate([
      'productOrderItems' => 'array|required',
      'seller_id' => 'numeric|required'
    ]);
    $sellerId = $validatedData['seller_id'];
    $productOrderItems = $validatedData['productOrderItems'];
    if ($productOrderItems) {
      DB::beginTransaction();
      try {
        $orderTotalPrice = $order->total_price;
        foreach ($productOrderItems as $productOrderItem) {
          // $totalOrderPrice += $itemData['total_price'];
          $productSku = $productOrderItem['product_sku'];
          $quantity = $productOrderItem['quantity'];
          $unitPrice = $productOrderItem['unit_price'];
          $totalPrice = $quantity * $unitPrice;
          $orderTotalPrice = $orderTotalPrice + $totalPrice;

          $product = Product::where('sku', $productSku)->first();
          $inventory = null;
          if ($product) {
            $inventory = $product->inventory;
          } else {
            $productVariation = ProductVariation::where('sku', $productSku)->first();
            if ($productVariation) {
              $inventory = $productVariation->inventory;
            }
          }

          if ($inventory && $inventory->stock_count >= $quantity) {
            $inventory->stock_count -= $quantity;
            $inventory->save();
          } else {
            // Rollback the transaction and return an error response
            DB::rollBack();
            return response()->json(['message' => 'Insufficient stock for the product'], 400);
          }



          // Create the order item
          $productOrderItemData = [
            // 'order_id' => $order->id,
            'product_sku' => $productSku,
            'type' => $productOrderItem['type'],
            'seller_id' => $sellerId,
            'quantity' => $quantity,
            'total_price' => $totalPrice,
            'unit_price' => $unitPrice,
          ];
          $order->productOrderItems()->create($productOrderItemData);
        }

        $order->total_price = $orderTotalPrice;

        if ($order->paid_amount < $order->total_price) {
          $order->payment_status = 'unpaid';
        }
        $order->save();

        DB::commit();
        return $order;
      } catch (Exception $e) {
        // If an error occurs, rollback the transaction and handle the error
        DB::rollBack();

        return response()->json(['message' => 'Could not add product to order'], 500);
      }
    }
    return response()->isClientError();
  }

  public function addMechanic(Request $request, String $orderId)
  {
    $validatedData = $request->validate([
      'mechanic_id' => 'required',
    ]);
    DB::beginTransaction();
    try {
      $order = Order::findOrfail($orderId);
      $mechanicId = $validatedData['mechanic_id'];
      $mechanic = Mechanic::findOrfail($mechanicId);

      if ($mechanic->status !== 'idle') {
        DB::rollBack();
        return response()->isServerError('message', 'Mechanic is unavailable');;
      }


      if ($order->time_status === 'waiting') {
        $order->time_status = 'running';
        $order->started_at = now();
        $order->save();
      }
      $serviceOrderItems = $order->serviceOrderItems;

      // DB::rollBack();
      // return $order;

      foreach ($serviceOrderItems as $serviceOrderItem) {
        $serviceOrderMechanic = ServiceOrderMechanic::create([
          'service_order_items_id' => $serviceOrderItem->id,
          'mechanic_id' => $mechanic->id
        ]);
        $serviceItem = ServiceOrderItem::find($serviceOrderItem->id);
        $serviceItem->status = $order->time_status;
        $serviceItem->service_started_at = $order->started_at;
        $serviceItem->save();
      }

      $mechanic->status = 'busy';
      $mechanic->save();



      DB::commit();
      return new OrderResource($order);
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => 'Could not add Mechanic to Service'], 500);
    }
  }




  public function createServiceItem(CreateServiceRequest $request)
  {
    $validatedData = $request->validated();

    // return $validatedData;

    DB::beginTransaction();
    try {
      $serviceTypeIds = $validatedData['service_type_ids'];
      $order = Order::create([
        'customer_id' => $validatedData["customer_id"],
        'seller_id' => $validatedData['seller_id'],
      ]);
      foreach ($serviceTypeIds as $serviceTypeId) {
        $serviceType = ServiceType::with('serviceTypeProducts')->findOrFail($serviceTypeId);
        $serviceTypeProducts = $serviceType->serviceTypeProducts;
        if ($serviceTypeProducts) {
          foreach ($serviceTypeProducts as $serviceTypeProduct) {
            $inventory = Inventory::where('sku', $serviceTypeProduct->product_sku)->first();
            if ($inventory && $inventory->stock_count > $serviceTypeProduct->quantity) {

              $inventory->stock_count = $inventory->stock_count - $serviceTypeProduct->quantity;
              $inventory->save();
            } else {
              DB::rollBack();
              return response()->json(['message' => 'Insufficient stock for the product'], 400);
            }
          }
        }

        $order->serviceOrderItems()->create([
          'service_type_id' => $serviceTypeId,
          'seller_id' => $validatedData['seller_id'],
          'problem_details' => $validatedData['problem_details'],
          'unit_price' => $serviceType->price,
          'total_price' => $serviceType->price
        ]);
      }

      $order->load(['serviceOrderItems']);

      DB::commit();

      return new OrderResource($order);
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => 'Order creation failed'], 500);
    }
  }

  public function attachPosItem(Request $request)
  {
    $validatedData = $request->validate([
      'order_id' => 'nullable',
      'seller_id' => 'required',
      'items' => 'required|array',
      'items.*.product_sku' => 'required|string',
      'items.*.type' => 'required|in:product,variation',
      'items.*.status' => 'in:paid,unpaid,cancelled,due',
      'items.*.quantity' => 'required|integer',
      'items.*.unit_price' => 'required',
      'items.*.discount' => 'nullable',
      'items.*.discountType' => 'in:flat,percent',

    ]);

    DB::beginTransaction();

    try {
      $sellerId = $validatedData['seller_id'];
      $order = Order::findOrFail($validatedData['order_id']);

      $items = $validatedData['items'];

      if (count($items) > 0) {
        $order->payment_status = 'unpaid';
      }

      foreach ($items as $itemData) {
        $productSku = $itemData['product_sku'];
        $quantity = $itemData['quantity'];



        $product = Product::where('sku', $productSku)->first();
        $inventory = null;
        if ($product) {
          $inventory = $product->inventory;
        } else {
          $productVariation = ProductVariation::where('sku', $productSku)->first();
          if ($productVariation) {
            $inventory = $productVariation->inventory;
          }
        }

        if ($inventory && $inventory->stock_count >= $quantity) {
          $inventory->stock_count -= $quantity;
          $inventory->save();
        } else {
          // Rollback the transaction and return an error response
          DB::rollBack();
          return response()->json(['message' => 'Insufficient stock for the product'], 400);
        }









        // $order->productOrderItems()->create($productOrderItemData);
        $existingProductOrderItem = $order->productOrderItems()->where('product_sku', $productSku)->first();

        if ($existingProductOrderItem) {
          $existingProductOrderItem->quantity += $quantity;
          $existingProductOrderItem->save();
        } else {

          $productOrderItemData = [
            // 'order_id' => $order->id,
            'product_sku' => $productSku,
            'type' => $itemData['type'],
            'seller_id' => $sellerId,
            'quantity' => $quantity,
            'unit_price' => $itemData['unit_price'],
            // 'discount' => $itemData['discount'],
            // 'discount_type' => $itemData['discountType'],
          ];
          $order->productOrderItems()->create($productOrderItemData);
        }
      }





      $order->save();

      $order->load(['customer', 'seller', 'productOrderItems']);

      // DB::rollBack();

      // return $orderDiscount;



      // Commit the database transaction
      DB::commit();

      // Return a success response or redirect as needed
      return new OrderResource($order);
      return response()->json(['message' => 'Product Attached successfully']);
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => 'Server Error'], 500);
    }
  }

  public function attachServiceItem(Request $request)
  {
    $validatedData = $request->validate([
      'order_id' => 'required',
      // 'service_type_id' => 'nullable|exists:service_types,id',
      'service_type_ids' => 'nullable|array',
      'service_type_ids.*' => 'exists:service_types,id',
      'seller_id' => 'nullable|exists:users,id',
      'problem_details' => 'nullable',
      // 'total_price' => 'required|numeric',
      // 'unit_price' => 'required|numeric',
      // 'tax' => 'required|integer',
      // 'discount' => 'required|integer',
    ]);


    DB::beginTransaction();
    try {
      $order = Order::findOrFail($validatedData['order_id']);
      $serviceTypeIds = $validatedData['service_type_ids'];
      if (count($serviceTypeIds) > 0) {
        $order->payment_status = 'unpaid';
      }
      foreach ($serviceTypeIds as $serviceTypeId) {
        $serviceType = ServiceType::with('serviceTypeProducts')->findOrFail($serviceTypeId);
        $serviceTypeProducts = $serviceType->serviceTypeProducts;
        if ($serviceTypeProducts) {
          foreach ($serviceTypeProducts as $serviceTypeProduct) {
            $inventory = Inventory::where('sku', $serviceTypeProduct->product_sku)->first();
            if ($inventory && $inventory->stock_count > $serviceTypeProduct->quantity) {

              $inventory->stock_count = $inventory->stock_count - $serviceTypeProduct->quantity;
              $inventory->save();
            } else {
              DB::rollBack();
              return response()->json(['message' => 'Insufficient stock for the product'], 400);
            }
          }
        }

        $order->serviceOrderItems()->create([
          'service_type_id' => $serviceTypeId,
          'seller_id' => $validatedData['seller_id'],
          'problem_details' => $validatedData['problem_details'],
          'unit_price' => $serviceType->price,
          'total_price' => $serviceType->price
        ]);
      }

      $order->load(['serviceOrderItems']);

      DB::commit();

      return new OrderResource($order);
    } catch (Exception $e) {
      // If an error occurs, rollback the transaction and handle the error
      DB::rollBack();

      return response()->json(['message' => 'Order creation failed'], 500);
    }
  }
  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, String $id)
  {
    $validated = $request->validate([
      'overallDiscount' => 'numeric',
      'overallDiscountType' => 'in:flat,percent',
      'overallTax' => 'numeric',
      'overallTaxType' => 'in:flat,percent',
      // 'paymentStatus' => 'in:paid,unpaid',
      'timeStatus' => 'in:waiting,running,finished',
      'payAmount' => 'numeric'
    ]);


    try {
      DB::beginTransaction();
      $order = Order::with('productOrderItems', 'serviceOrderItems')->find($id);

      if ($order->time_status === 'finished') {
        throw new Exception('Order is already finished');
      }

      // if ($validated['paymentStatus']) {
      //   $order->payment_status = $validated['paymentStatus'];
      // }
      if ($validated['timeStatus']) {
        $order->time_status = $validated['timeStatus'];
      }


      $overallDiscount = $validated['overallDiscount'];
      $overallTax = $validated['overallTax'];
      $overallDiscountType = $validated['overallDiscountType'];
      $overallTaxType = $validated['overallTaxType'];
      $totalPrice = 0;



      foreach ($order->productOrderItems as $productOrderItem) {
        $totalPrice = $totalPrice + $productOrderItem->total_price;
      }

      foreach ($order->serviceOrderItems as $serviceOrderItem) {
        $totalPrice = $totalPrice + $serviceOrderItem->total_price;
      }
      if ($overallDiscount && $overallDiscount > 0) {
        $order->overall_discount = $overallDiscount;
        if ($overallDiscountType) {
          $order->overall_discount_type = $overallDiscountType;

          if ($overallDiscountType === 'flat') {
            $totalPrice -= $overallDiscount;
          } else {
            $totalPrice = $totalPrice - ($totalPrice * $overallDiscount / 100);
          }
        }
      }
      if ($overallTax && $overallTax > 0) {
        $order->overall_tax = $overallTax;
        if ($overallTaxType) {
          $order->overall_tax_type = $overallTaxType;

          if ($overallTaxType === 'flat') {
            $totalPrice -= $overallTax;
          } else {
            $totalPrice = $totalPrice - ($totalPrice * $overallTax / 100);
          }
        }
      }
      // $order->customerId = $request->customerId;
      // $order->customer_id = $request->customer_id;
      // $order->total = $request->total;
      // $order->discount = $request->discount;
      // $order->tax = $request->tax;
      // $order->note = $request->note;
      // $order->status = $request->status;

      // $order->total_price = $totalPrice;


      if ($order->time_status === 'finished') {
        $order->finished_at = now();
      }

      $total = round($order->total_price, 2);

      $payAmount = round($validated['payAmount'], 2);
      $totalPaidAmount = round($order->paid_amount, 2) + $payAmount;
      $due = $total - $totalPaidAmount;

      if ($due < 0) {
        throw new Exception('Invalid : Pay amount exceeds total');
      }
      $order->paid_amount = $totalPaidAmount;
      if ($due == 0) {
        $order->payment_status = 'paid';
      }
      if ($due > 0) {
        $order->payment_status = 'unpaid';
      }


      // throw new Exception('testing out things');

      $order->save();



      DB::commit();
      return $order;
    } catch (Exception $e) {
      DB::rollBack();
      return send_error($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(String $id)
  {
    $order = Order::find($id);
    $order->delete();
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
