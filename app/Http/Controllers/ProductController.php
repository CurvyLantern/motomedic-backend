<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
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
use App\Http\Resources\ProductCollection;
use App\Models\AttributeValue;
use App\Models\Color;
use App\Models\Inventory;
use App\Models\ProductVariation;
use Database\Factories\AttributeValueFactory;
use Illuminate\Http\Request;

class ProductController extends Controller
{

  /**
   * Display a listing of the resource.
   *  @return \Illuminate\Http\JsonResponse
   */

  public function search(Request $request)
  {
    $searchQuery = $request->input('query');


    // Search for products by name, SKU, or ID in the 'products' table
    $products = Product::where('name', 'like', '%' . $searchQuery . '%')
      ->orWhere('sku', 'like', '%' . $searchQuery . '%')
      ->orWhere('id', $searchQuery)
      ->get();

    // return response()->json(compact('products'));

    // Search for products by SKU, ID, or name in the 'product_variations' table
    $variationProducts = ProductVariation::where('name', 'like', '%' . $searchQuery . '%')
      ->orWhere('sku', 'like', '%' . $searchQuery . '%')
      ->orWhere('id', $searchQuery)
      ->orWhereHas('product', function ($query) use ($searchQuery) {
        $query->where('name', 'like', '%' . $searchQuery . '%');
      })
      ->get();

    // Combine the results from both tables into a single collection
    $allProducts = $products->concat($variationProducts);

    // You now have a collection of products matching the search term
    return response()->json($allProducts);
  }

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
  public function index(Request $request)
  {
    //
    //        $products = Product::orderBy('id','asc')->paginate(15);
    $perPage = $request->query('perPage', 10); // Set your preferred items per page here
    $categoryId = $request->query('categoryId', '');
    // Retrieve products and sort by 'created_at' in descending order
    // $products = Product::orderBy('created_at', 'desc')->paginate($perPage);
    $products = [];
    $variations = [];
    if ($categoryId !== '') {
      $category = Category::with('children')->findOrFail($categoryId);
      $categoryIds = $category->children->pluck('id')->toArray();
      $categoryIds[] = $categoryId;

      // Retrieve products filtered by category and sort by 'created_at' in descending order
      $products = Product::with('variations', 'brand', 'category', 'color')
        ->whereIn('category_id', $categoryIds)
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

      $variations = $products->pluck('variations')->flatten()->toArray();

      // Add stock_count to each product
    } else {
      $products = Product::with('variations', 'brand', 'category', 'color')
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);
      $variations = $products->pluck('variations')->flatten()->toArray();
    }



    foreach ($products as $product) {
      $inventory = Inventory::where('sku', $product->sku)->first();
      $product->stock_count = $inventory->stock_count ?? 0; // Default to 0 if no inventory record found
    }

    foreach ($variations as &$variation) {
      $inventory = Inventory::where('sku', $variation['sku'])->first();
      $variation['stock_count'] = $inventory->stock_count ?? 0; // Default to 0 if no inventory record found
    }
    unset($variation);


    $productsAndVariations = array_merge($products->items(), $variations);
    return new ProductCollection($productsAndVariations);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreProductRequest $request)
  {

    $validated = $request->validated();
    $product = Product::create($validated);

    // Generate the 'sku' based on the product's ID
    $product->sku = 'SKU-' . $product->id;
    $product->save();

    $productInventory = Inventory::create([
      'sku' => $product->sku,
    ]);

    $variations = $request->variations;


    foreach ($variations as $variationData) {
      // Create a new ProductVariation instance
      $variation = ProductVariation::create([
        'color_id' => $variationData['color_id'],
        'price' => $variationData['price'],
        'name' => $variationData['name']
        // 'image' => $variationData['image'],
      ]);

      // Generate the 'sku' based on the desired format
      $sku = $variation->id . '-' . $variationData['color_id'] . '' . implode('', $variationData['attribute_value_ids']);

      // Set the 'sku' for the variation
      $variation->sku = $sku;

      // Save the variation to the database
      $variation->save();

      $variationInventory = Inventory::create([
        'sku' => $variation->sku,
      ]);

      // Associate the variation with the product (assuming $product is the product model)
      $product->variations()->save($variation);

      // Loop through the attribute_value_ids and associate each one with the variation
      foreach ($variationData['attribute_value_ids'] as $attributeValueId) {
        // Find the corresponding attribute value
        $attributeValue = AttributeValue::find($attributeValueId);

        // Associate the attribute value with the variation
        $variation->attributeValue()->associate($attributeValue);
      }
    }

    return response()->json(compact('variations', 'validated', 'product'));

    // $categories = Category::all();
    // $brands = Brand::all();
    // $category = Category::findOrFail($validated('categoryId'));

    try {

      if ($request->hasFile('image')) {
        $imagePrefix = 'motomedic-media-image-';
        $formattedTimestamp = Carbon::now()->format('Ymd_His');

        $imageName = $imagePrefix . $formattedTimestamp . '.' . $request->file('image')->getClientOriginalExtension();
        $validated['image'] = $request->file('image')->storeAs('image', $imageName);
      }


      // products() function is from category model relation
      $product = $category->products()->create([
        'categoryId' => $validated['category'],
        'productName' => $validated['productName'],
        'slug' =>  Str::slug($validated['productName'], '-'),
        'brandId' => $validated['brandId'],
        'model' => $validated['model'],
        'color' => $validated['color'],
        'tags' => $validated['tags'],
        'size' => $validated['size'],
        'year' => $validated['year'],
        'compitibility' => $validated['compitibility'],
        'condition' => $validated['condition'],
        'weight' => $validated['weight'],
        'manufacturer' => $validated['manufacturer'],
        'price' => $validated['price'],
        'quantity' => $validated['quantity'],
        'price' => $validated['price'],
        'discoundType' => $validated['discoundType'],
        'discount' => $validated['discount'],
        'primaryImg' => $image_path,
        'shortDescriptions' => $validated['shortDescriptions'],
        'longDescriptions' => $validated['longDescriptions'],
        'installationMethod' => $validated['installationMethod'],
        'warranty' => $validated['warranty'],
        'note' => $validated['note'],
        'availability' => $validated['availability'],
        'status' => $validated['status'],
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
