<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
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


  /**
   * Show the form for creating a new resource.
   */
  public function store(StoreServiceRequest $request)
  {
    $validated = $request->validated();
    try {
      $service = Service::create([
        'name' => $validated["name"],
        'description' => $validated["description"],
        'price' => $validated["price"],
        'duration' => $validated["duration"],
        'note' => $validated["note"],
        'mechanic_id' => $validated["mechanic_id"],
      ]);
      return send_response("Service create successfull", new ServiceResource($service));
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
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
