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
    // Define your prefix and any formatting you need
    $prefix = 'moto-';
    $serialNumber = mt_rand(1000, 9999); // Generate a random 4-digit number // SaaS model

    // Combine the prefix and serial number
    $jobNumber = $prefix . $serialNumber;

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

      $service = Service::create($validated);



      return send_response('service Create successfull' , $service);

    }catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }

    // old code ...............................

//    try {
//      $service = Service::create([
//        'name' => $validated["name"],
//        'sku' => Str::slug($validated['name'], '-'),
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
//      return send_response("Service create successfull", new ServiceResource($service));
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

        $service->name = $request->name;
        $service->slug = Str::slug($request->serviceName, '-');
        $service->description = $request->description;
        $service->price = $request->price;
        $service->duration = $request->duration;
        $service->note = $request->note;
        $service->mechanic_id = $request->mechanic_id;
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
