<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Http\Requests\StoreColorRequest;
use App\Http\Requests\UpdateColorRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $colors = Color::orderBy('id', 'asc')->paginate(10);
            if ($colors) {
                $context = [
                    'colors' => $colors,
                ];
                return send_response('Colors Data Found ! ', $context);
            } else {
                return send_error('No Color Found !!');
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreColorRequest $request)
    {
        $validated = $request->validated();
        // dd($validated);

        try {
            $color = Color::create([

                "name" => $request->brandName,
                "name" => $request->brandName,
            ]);

            $context = [
                'color' => $color,
            ];
            return send_response('Color create successfull !', $context);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Color $color)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateColorRequest $request, Color $color)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
    {
        //
    }
}
