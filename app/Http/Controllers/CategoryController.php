<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Exception;
use App\Models\Category;
use App\Models\Product;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;


class CategoryController extends Controller
{

    public function getCategoryAttributeData()
    {
        $tableName = 'categories'; // Replace with the actual table name

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

        $parentCategories = Category::allWithChildren();

        return $parentCategories;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('image')) {
                $imagePrefix = 'motomedic-media-image-';
                $formattedTimestamp = Carbon::now()->format('Ymd_His');

                $imageName = $imagePrefix . $formattedTimestamp . '.' . $request->file('image')->getClientOriginalExtension();
                $validated['image'] = $request->file('image')->storeAs('image', $imageName);
            }

            $category = Category::create($validated);

            $hasSubcategories = $request->has('sub_categories');
            if ($hasSubcategories) {
                foreach ($request['sub_categories'] as $subCategoryData) {
                    $category->children()->create([
                        'name' => $subCategoryData['name']
                    ]);
                }
            }
            return response()->json(['message' => 'Category created successfully']);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */

    public function show(String $id)
    {
        $category = Category::find($id);


        if ($category) {
            return send_response('Category founded !', $category);
        } else {
            return send_error('Category Not found !!!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, String $id)
    {
        $validator = $request->validate();
        // if ($validator->fails()) {
        //     return send_error('Validation Error', $validator->errors(), 422);
        // }

        try {

            $category = Category::find($id);
            $category->categoryName = $request->categoryName;
            $category->slug = $request->slug;
            $category->description = $request->description;
            $category->img = $request->img;
            $category->parentCategoryId = $request->parentCategoryId;
            $category->save();

            $context = [
                'category' => $category,
            ];

            return send_response('Category update successfully', $context);
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
            $category = Category::find($id);
            if ($category) {
                $category->delete();
                return response()->noContent();
            } else {
                return response()->isNotFound();
            }
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }


    // products according to category
    public function categoryProducts(String $id)
    {

        // $category = Category::findOrFails($id);
        // $categories = Category::all();
        // $products = Product::all();

        try {

            // $products = Product::all()->where('categoryId',$request->id);
            $products = Product::where('categoryId', $id)->get();

            if ($products) {

                $context = [
                    'products' => $products,
                ];

                return send_response('Products by categories .. ', $context);
            } else {
                return send_error('Not Products found !!', []);
            }
        } catch (Exception $e) {
            return send_error('Category update failed !!!', []);
        }
    }
}
