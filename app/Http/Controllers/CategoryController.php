<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Category;
use App\Models\Product;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CateogryResource;
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
        // $category = Category::orderBy('id', 'asc')->get();

        // $context = [
        //     'categories' =>  $category,
        // ];

        $parentCategories = Category::with('children')->whereNull('parent_category_id')->get();

        return CateogryResource::collection($parentCategories);

        // return send_response('Category data successfully loaded !!', $context);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        try {
            $validated = $request->validated();
            $category = Category::create([
                'name' => $validated['name'],
                'parent_category_id' => $validated['parent_category_id'] ?? null,
            ]);
            $hasSubcategories = $request->has('sub_categories');
            if ($hasSubcategories) {
                foreach ($request['sub_categories'] as $subCategoryData) {
                    $category->children()->create([
                        'name' => $subCategoryData['name']
                    ]);
                }
            }
            return response()->json(['message' => 'Category created successfully']);


            // if ($validator->fails()) {
            //     return send_error('Data validation Failed !!', $validator->errors(), 422);
            // }
            //create category and save it to database
            if ($request->hasFile('img')) {
                $imagePath = $request->file('img')->store('category', 'public');
            }

            $category = Category::create([
                "categoryName" => $request->categoryName,
                'slug' =>  Str::slug($request->categoryName, '-'),
                "description" => $request->description,
                "img" => $imagePath,
                "parentCategoryId" => $request->parentCategoryId,
            ]);
            $context = [
                'category' => $category,
            ];


            return send_response('Category create successfull !', $context);
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
            }
            return send_response('Category Deleted successfully', []);
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
