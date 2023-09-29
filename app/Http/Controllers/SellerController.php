<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Seller;
use App\Http\Requests\StoreSellerRequest;
use App\Http\Requests\UpdateSellerRequest;
use App\Http\Resources\SellerResource;

class SellerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mechanics = Seller::orderBy('id', 'asc')->paginate(15);

        return SellerResource::collection($mechanics);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSellerRequest $request)
    {
        $validated = $request->validated();
        try {

            $customer = Seller::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'bike_info' => $request->bike_info,
            ]);

            return send_response('Seller Create Success !', $customer);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Seller $seller, String $id)
    {
        try {
            $seller = Seller::whereId($id)->firstOrFail();
            if ($seller) {

                $context = [
                    'seller' => $seller,
                ];
                return SellerResource::collection($context);
            } else {
                return send_error('Seller not found !', []);
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSellerRequest $request, Seller $seller, $id)
    {
        $validated = $request->validated();
        try {

            $seller = Seller::find($id);

            $seller->name = $request->name;
            $seller->email = $request->email;
            $seller->phone = $request->phone;
            $seller->address = $request->address;
            $seller->bike_info = $request->bike_info;
            $seller->status = $request->status;

            $seller->save();

            $context = [
                'seller' => $seller,
            ];

            return SellerResource::collection($context);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seller $seller, String $id)
    {
        try {
            $seller = Seller::find($id);
            if ($seller) {
                $seller->delete();
            } else {
                return send_response('seller Not Found !', []);
            }
            return send_response('seller Deleted successfully', []);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }
}
