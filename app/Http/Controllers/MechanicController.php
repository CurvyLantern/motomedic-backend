<?php

namespace App\Http\Controllers;

use Exception;
use App\Http\Resources\MechanicResource;
use App\Models\Mechanic;
use App\Http\Requests\StoreMechanicRequest;
use App\Http\Requests\UpdateMechanicRequest;

class MechanicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mechanics = Mechanic::orderBy('id', 'asc')->paginate(15);

        return MechanicResource::collection($mechanics);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMechanicRequest $request)
    {
        $validated = $request->validated();
        try {
            // Create an admin record associated with the user
            $mechanic = Mechanic::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return send_response('Mechanic create Success !', $mechanic);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        try {
            //            $mechanic = Mechanic::find($id)->first();
            $mechanic = Mechanic::whereId($id)->firstOrFail();
            if ($mechanic) {
                $context = [
                    'mechanic' => $mechanic,
                ];
                return MechanicResource::collection($context);
            } else {
                return send_error('mechanic not found !', []);
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMechanicRequest $request, Mechanic $mechanic, String $id)
    {
        $validated = $request->validated();
        try {

            $mechanic = Mechanic::find($id);

            $mechanic->name = $request->name;
            $mechanic->email = $request->email;
            $mechanic->phone = $request->phone;
            $mechanic->address = $request->address;
            $mechanic->status = $request->status;

            $mechanic->save();

            $context = [
                'mechanic' => $mechanic,
            ];

            return MechanicResource::collection($context);
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
            $mechanic = Mechanic::find($id);
            if ($mechanic) {
                $mechanic->delete();
            } else {
                return send_response('Mechanic Not Found !', []);
            }
            return send_response('Mechanic Deleted successfully', []);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }
}
