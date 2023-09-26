<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\BrandResource;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ColorResource;
use App\Models\Color;

class ProductController extends Controller
{

    /**
     * Display a listing of the resource.
     *  @return \Illuminate\Http\JsonResponse
     */

    public function createInfos()
    {
        $categories = Category::allWithChildren();

        $brands = BrandResource::collection(Brand::orderBy('id', 'asc')->get());

        $colors = ColorResource::collection(Color::all());
        return response()->json(compact('categories', 'brands', 'colors'));
    }

    public function getProductAttributeData()
    {
        $tableName = 'products'; // Replace with the actual table name

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
        //
        //        $products = Product::orderBy('id','asc')->paginate(15);
        $products = Product::all()->sort('id', 'desc')->forPage(1, 15);
        $context = [
            'products' => $products,
        ];

        return send_response('Products Data successfully loaded !', $context);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $categories = Category::all();
        $brands = Brand::all();
        $validator = $request->validated();
        $category = Category::findOrFail($validator('categoryId'));

        try {
            $image_path = '';
            if ($request->hasFile('primaryImg')) {
                $image_path = $request->file('primaryImg')->store('products', 'public');
            }
            // products() function is from category model relation
            $product = $category->products()->create([
                'categoryId' => $validator['category'],
                'productName' => $validator['productName'],
                'slug' =>  Str::slug($validator['productName'], '-'),
                'brandId' => $validator['brandId'],
                'model' => $validator['model'],
                'color' => $validator['color'],
                'tags' => $validator['tags'],
                'size' => $validator['size'],
                'year' => $validator['year'],
                'compitibility' => $validator['compitibility'],
                'condition' => $validator['condition'],
                'weight' => $validator['weight'],
                'manufacturer' => $validator['manufacturer'],
                'price' => $validator['price'],
                'quantity' => $validator['quantity'],
                'price' => $validator['price'],
                'discoundType' => $validator['discoundType'],
                'discount' => $validator['discount'],
                'primaryImg' => $image_path,
                'shortDescriptions' => $validator['shortDescriptions'],
                'longDescriptions' => $validator['longDescriptions'],
                'installationMethod' => $validator['installationMethod'],
                'warranty' => $validator['warranty'],
                'note' => $validator['note'],
                'availability' => $validator['availability'],
                'status' => $validator['status'],
            ]);
            // media_images()
            // Upload multiple thumbnail image
            if ($request->hasFile('thumbImg')) {
                $image_path = '';
                foreach ($request->file('thumbImg') as $img) {

                    $image_path = $img->store('products', 'public');

                    $product->media_images()->create([
                        'hostId' => $product->id,
                        'imageName' => $img->getClientOriginalName(),
                        'imagePath' => $image_path,
                    ]);
                }
            }

            if ($request->productType == 'variationProduct') {

                // This is a logical mistake as it's not obvious which array contains the whole collection of values.
                foreach ($request->attributesData as $key => $attributes) {
                    $image_path = '';

                    if ($request->hasFile('attribiuteImgId')) {
                        $image_path = $attributes->file('attribiuteImgId')->store('products', 'public');
                    }
                    $product->attributes()->create([
                        'productId' => $product->id,
                        'sku' => $attributes->sku,
                        'attribiuteImgId' => $image_path,
                        'discount' => $attributes->discount,
                        'discountType' => $attributes->discountType,
                        'size' => $attributes->size,
                        'weight' => $attributes->weight,
                        'quantity' => $attributes->quantity,
                        'color' => $attributes->color,
                    ]);
                }
            }

            $context = [
                'product' => $product,
                'categories' => $categories,
                'brands' => $brands,
            ];
            return send_response('Product Stored successfull', $context);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        $products = Product::find($id);


        if ($products) {
            return send_response('Products founded !', $products);
        } else {
            return send_error('Products Not found !!!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, String $id)
    {
        $validator = $request->validate();

        // if ($validator->fails()) {
        //     return send_error('Data validation Failed !!', $validator->errors(), 422);
        // }

        try {

            $product = Product::find($id);

            if ($request->hasFile('primaryImg')) {
                // Delete old image
                if ($product->primaryImg) {
                    Storage::delete($product->primaryImg);
                }
                // Store image
                $image_path = $request->file('primaryImg')->store('products', 'public');
                // Save to Database
                $product->primaryImg = $image_path;
            }

            $product->productName = $request->productName;
            $product->slug = $request->slug;
            $product->categoryId = $request->categoryId;
            $product->brandId = $request->brandId;
            $product->model = $request->model;
            $product->color = $request->color;
            $product->tags = $request->tags;
            $product->productType = $request->productType;
            $product->material = $request->material;
            $product->size = $request->size;
            $product->year = $request->year;
            $product->compitibility = $request->compitibility;
            $product->condition = $request->condition;
            $product->manufacturer = $request->manufacturer;
            $product->weight = $request->weight;
            $product->quantity = $request->quantity;
            $product->price = $request->price;
            $product->discoundType = $request->discoundType;

            $product->thumbImg = $request->thumbImg;
            $product->shortDescriptions = $request->shortDescriptions;
            $product->longDescriptions = $request->longDescriptions;
            $product->installationMethod = $request->installationMethod;
            $product->note = $request->note;
            $product->warranty = $request->warranty;
            $product->rating = $request->rating;
            $product->availability = $request->availability;
            $product->status = $request->status;

            $product->save();

            $context = [
                'product' => $product,
            ];
            return send_response("Product Update successfully !", $context);
        } catch (Exception $e) {
            return send_error("Produc data update failed !!!");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        try {
            $products = Product::find($id);
            if ($products) {
                $products->delete();
            }
            return send_response('products Deleted successfully', []);
        } catch (Exception $e) {
            return send_error($e->getMessage(), $e->getCode());
        }
    }
}
