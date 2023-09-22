<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Exception;

class BrandController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    // public function testBrand(Request $req){
    //     return send_response('dasdasd',[]);
    //  }

    public function getBrandsAttributeData()
    {
        $tableName = 'brands'; // Replace with the actual table name

        if (Schema::hasTable($tableName)) {
            $columnNames = Schema::getColumnListing($tableName);
            return $columnNames;
        } else {
            return ['Table not found'];
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::orderBy('id', 'asc')->get();
        if ($brands) {
            return BrandResource::collection($brands);
        } else {
            return send_response('Brand data not found !!', []);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request)
    {
        //
        $validated = $request->validated();


        // if ($validator->fails()) {
        //     return send_error('Data validation Failed !!', $validator->errors(), 422);
        // }

        try {
            //create brand and save it to database
            // if ($request->hasFile('img')) {
            //     $imagePath = $request->file('img')->store('brand', 'public');
            // }

            $brand = Brand::create($validated);
            $context = [
                'brand' => $brand,
            ];


            return send_response('Brand create successfull !', $context);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        $brand = Brand::find($id);


        if ($brand) {
            return send_response('Brand founded !', $brand);
        } else {
            return send_error('Brand Not found to show!!!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, String $id)
    {
        //
        $validator = $request->validate();

        // if ($validator->fails()) {
        //     return send_error('Validation Error', $validator->errors(), 422);
        // }

        try {

            $brand = Brand::find($id);
            $brand->brandName = $request->brandName;
            $brand->slug = $request->slug;
            $brand->description = $request->description;
            $brand->img = $request->img;
            $brand->save();

            $context = [
                'brand' => $brand,
            ];

            return send_response('Brand update successfully', $context);
        } catch (Exception $e) {
            return send_error('Brand update failed !!!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        //
        try {
            $brand = Brand::find($id);
            if ($brand) {
                $brand->delete();
                return send_response('0Brand Deleted successfully', []);
            } else {
                return send_error('Brand Not Found to delete !!');
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }
}
