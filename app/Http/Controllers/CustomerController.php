<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Exception;
use App\Models\Customer;
use App\Models\User;
use App\Models\UserDetail;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use PhpParser\Node\Scalar\String_;

class CustomerController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $customers = Customer::orderBy('created_at', 'desc')->get();
    return CustomerResource::collection($customers)->all();
  }

  /**
   * Display the specified resource.
   */
  public function show(String $id)
  {
    try {
      $customer = Customer::whereId($id)->firstOrFail();
      if ($customer) {

        $context = [
          'customer' => $customer,
        ];
        return CustomerResource::collection($context);
      } else {
        return send_error('Customer not found !', []);
      }
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreCustomerRequest $request)
  {
    $validated = $request->validated();
    try {
      // Create an admin record associated with the user
      $customer = Customer::create($validated);
      return new CustomerResource($customer);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }



  /**
   * Update the specified resource in storage.
   */
  // String $id
  public function update(UpdateCustomerRequest $request, Customer $customer, String $id)
  {
    $validated = $request->validated();
    try {

      $customer = Customer::find($id);

      $customer->customerName = $validated->name;
      $customer->email = $validated->email;
      $customer->phone = $validated->phone;
      $customer->address = $validated->address;
      $customer->bike_info = $validated->bike_info;
      $customer->status = $validated->status;

      $customer->save();

      $context = [
        'customer' => $customer,
      ];

      return CustomerResource::collection($context);
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
      $customer = Customer::find($id);
      if ($customer) {
        $customer->delete();
      } else {
        return send_response('Customer Not Found !', []);
      }
      return send_response('Customer Deleted successfully', []);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }
}
