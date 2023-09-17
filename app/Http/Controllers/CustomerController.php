<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Customer;
use App\Models\User;
use App\Models\UserDetail;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::orderBy('id', 'asc')->paginate(15);

        $context = [
            'customers' => $customers,
        ];

        // return send_response('Customers Data successfully loaded !', $context);
        return CustomerResource::collection($customers);
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        try {


            $customer = Customer::whereId($id)->firstOrFail();

            $customerDetails = UserDetail::where('id', $customer->userDetailsId)->firstOrFail();



            if ($customer) {

                $context = [
                    'customer' => $customer,
                    'customerDetails' => $customerDetails,
                ];
                return send_response('Customer founded !', $context);
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
        if (!$validated) {
            return send_error('Data validation Failed !!', $validated->errors(), 422);
        }


        try {

            // Create a new user
            $user = User::create([
                'email' => $request->email,
                'name' => $request->customerName,
                'password' => bcrypt($request->password),
                'phone' => $request->phone,
            ]);

            // Create an admin record associated with the user
            $customer = Customer::create([
                'customerName' => $request->customerName,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'phone' => $request->phone,
            ]);


            return send_response('Customer Login Success !', $customer);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }



    /**
     * Update the specified resource in storage.
     */
    // String $id
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $validator = $request->validate();
        // if ($validator->fails()) {
        //     return send_error('Data validation Failed !!', $validator->errors(), 422);
        // }

        try {

            $customer = Customer::find($customer);

            $customer->customerName = $request->customerName;
            $customer->email = $request->email;
            $customer->phone = $request->phone;
            $customer->password = $request->password;

            $customer->save();

            $context = [
                'customer' => $customer,
            ];

            return send_response('Customer Update Successfull ', $customer);
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
