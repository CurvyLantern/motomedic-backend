<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Mechanic;
use App\Models\Product;
use Carbon\Carbon;
use Exception;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use Illuminate\Support\Str;

class ServiceController extends Controller
{


  public function apiTest()
  {
    $services = Service::orderBy('id', 'asc')->get();

    $context = [
      'services' => $services,
    ];
    //        return send_response('Products Data successfully loaded !', $context);

    return view('apiTest', compact('context'));
  }

  public function apiCreatePage()
  {

    $customers = Customer::all();
    $mechanics = Mechanic::all();
    $products = Product::all();

    $context = [
      'customers' => $customers,
      'mechanics' => $mechanics,
      'products' => $products,
    ];
    return view('apiCreate', compact('context'));
  }



  // ................... blade test end .........



  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $service = Service::orderBy('id', 'asc')->paginate(5);

    if ($service) {
      return ServiceResource::collection($service);
    } else {
      return send_error('Data fetching task failed !!');
    }
  }

  /**
   * Display the specified resource.
   * @param  \App\Models\Service  $service
   */
  public function show($id)
  {
    //

    $service = Service::find($id);

    if ($service) {

      $context = [
        'service' => $service,
      ];
      return ServiceResource::collection($context);
    } else {
      return send_error("Service Data Not Found ");
    }
  }

  public function generateJobNumber()
  {

    $maxNumericPart = Service::selectRaw("MAX(CAST(SUBSTRING(job_number, 6) AS UNSIGNED)) as maxNumericPart")
      ->whereRaw("job_number LIKE 'moto-%'")
      ->first();

    // Extract the maximum numeric part and increment by 1
    $newNumericPart = $maxNumericPart->maxNumericPart + 1;

    // Add the prefix back
    $prefix = 'moto-';
    $jobNumber = $prefix . $newNumericPart;

    return $jobNumber;
  }

  /**
   * Show the form for creating a new resource.
   */
  public function store(StoreServiceRequest $request)
  {

    $validated = $request->validated();

    try {
      $validated['slug'] = Str::slug($validated['name'], '-');
      $validated['type'] = 'service';
      $validated['job_number'] = $this->generateJobNumber();
      $validated['elapsed_time'] = Carbon::now()->format('Ymd_His');
      $validated['items'] = json_encode($validated['items']);;

      $service = Service::create($validated);



      return send_response('service Create successfull' , new ServiceResource($service));

    }catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }

    // old code ...............................

//    try {
//      $service = Service::create([
//        'name' => $validated["name"],
//        'slug' => Str::slug($validated['name'], '-'),
//        'description' => $validated["description"],
//        'price' => $validated["price"],
//        'duration' => $validated["duration"],
//        'note' => $validated["note"],
//        'mechanic_id' => $validated["mechanic_id"],
//
////        'type',
////        'service_type',
////        'job_number',
////        'customer_id',
////        'problem_details',
////        'mechanic_id',
////        'price',
////        'items',
////        'elapsed_time',
////        'note',
////        'status',
//      ]);
//      return send_response("Service create successfully", new ServiceResource($service));
//    } catch (Exception $e) {
//      return send_error($e->getMessage(), $e->getCode());
//    }
  }



  /**
   * Update the specified resource in storage.
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Service  $service
   * @return \Illuminate\Http\JsonResponse
   */
  public function update(StoreServiceRequest $request, $id)
  {
    $validated = $request->validated();
    try {

      $service = Service::find($id);
      if ($service) {

        $service->name = $validated['name'];
        $service->slug = Str::slug($request->serviceName, '-');
        $service->service_type = $validated['service_type'];
        $service->customer_id = $validated['customer_id'];
        $service->problem_details = $validated['problem_details'];
        $service->mechanic_id = $validated['mechanic_id'];
        $service->price = $validated['price'];
        $service->items = $validated['items'];
        $service->elapsed_time = $validated['elapsed_time'];
        $service->note = $validated['note'];
        $service->status = $validated['status'];
        $service->save();
        return send_response("Service Update successfully !", new ServiceResource($service));
      } else {
        return send_response('No Service found !!', []);
      }
    } catch (Exception $e) {
      return send_error("Service data update failed !!!", $e->getMessage(), $e->getCode());
    }
  }

  public function destroy($id)
  {
    try {
      $service = Service::find($id);
      if ($service) {
        $service->delete();
      }
      return send_response("service delete successfully !", []);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }
}
