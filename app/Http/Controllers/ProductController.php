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
use App\Http\Resources\ProductModelResource;
use App\Http\Resources\ProductResource;
use App\Models\AttributeValue;
use App\Models\Color;
use App\Models\Inventory;
use App\Models\ProductModel;
use App\Models\ProductVariation;
use Database\Factories\AttributeValueFactory;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

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
    $categories = CategoryResource::collection(Category::allWithChildren());

    $brands = BrandResource::collection(Brand::with('productModels')->orderBy('id', 'asc')->get());

    $colors = ColorResource::collection(Color::orderBy('id', 'asc')->get());

    $productModels = ProductModelResource::collection(ProductModel::with('brands')->orderBy('id', 'asc')->get());
    return response()->json(compact('productModels', 'categories', 'brands', 'colors'));
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

  public function allProducts(Request $request)
  {

    try {
      $products = Product::with('variations.attributeValues', 'variations.color', 'brand', 'category', 'color')
        ->orderBy('created_at', 'desc')
        ->get();

      foreach ($products as $product) {
        $inventory = Inventory::where('sku', $product->sku)->first();
        $product->stock_count = $inventory->stock_count ?? 0; // Default to 0 if no inventory record found
        $parentCategoryId = $product->category->parent_category_id;
        $product->parent_category_id = $parentCategoryId;
        // Attach the category_id to each variation of the product
        $variations = $product->variations;
        foreach ($variations as &$variation) {

          $variation->parent_category_id = $parentCategoryId;
          $variation->category_id = $product->category_id;
          $variation->brand_id = $product->brand_id;
          $inventory = Inventory::where('sku', $variation->sku)->first();
          $variation->stock_count = $inventory->stock_count ?? 0; // Default to 0 if no inventory record found
        }
        unset($variation);

        // Replace the product's variations with the updated versions
        $product->setRelation('variations', $variations);
      }

      $variations = $products->pluck('variations')->flatten()->toArray();

      $productsAndVariations = array_merge($products->toArray(), $variations);
      return ProductResource::collection($productsAndVariations)->all();
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
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

    $variationEnabled = $validated['variation_enabled'];
    $variations = $request->variations;

    if ($variationEnabled) {
      $product->barcode = null;
      $product->save();
      foreach ($variations as $variationData) {
        // Create a new ProductVariation instance
        $variation = ProductVariation::create([
          'color_id' => $variationData['color_id'],
          'name' => $variationData['name'],
          'barcode' => $variationData['barcode'],
          // 'image' => $variationData['image'],
        ]);

        // Generate the 'sku' based on the desired format
        $sku = 'SKU-' . $variation->id . $variationData['color_id'] . implode('', $variationData['attribute_value_ids']);

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
          // $variation->attributeValue()->associate($attwributeValue);
          $variation->attributeValues()->attach($attributeValue);
        }
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
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(String $id)
  {
    $product = Product::with('variations.attributeValues', 'variations.color', 'brand', 'category', 'color')->where('id', $id)
      ->orWhere('sku', $id)
      ->first();


    if ($product) {
      $inventory = Inventory::where('sku', $product->sku)->first();
      $product->stock_count = $inventory->stock_count ?? 0; // Default to 0 if no inventory record found
      $parentCategoryId = $product->category->parent_category_id;
      $product->parent_category_id = $parentCategoryId;
      // Attach the category_id to each variation of the product
      $variations = $product->variations;
      foreach ($variations as &$variation) {

        $variation->parent_category_id = $parentCategoryId;
        $variation->category_id = $product->category_id;
        $variation->brand_id = $product->brand_id;
        $inventory = Inventory::where('sku', $variation->sku)->first();
        $variation->stock_count = $inventory->stock_count ?? 0; // Default to 0 if no inventory record found
      }
      unset($variation);

      // Replace the product's variations with the updated versions
      $product->setRelation('variations', $variations);

      return response()->json(compact('product'));
    } else {
      return send_error('Products Not found !!!');
    }
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateProductRequest $request, String $id)
  {


    $validated = $request->validated();
    try {

      $product = Product::find($id);
      $product->fill($validated);
      $product->save();

      foreach ($request['variations_old'] as $variationData) {
        $variation = $product->variations()->where('id', $variationData['id'])->first();

        if ($variation) {
          if (isset($variationData['deleted']) && $variationData['deleted']) {
            $inventory = Inventory::where('sku', $variation->sku)->first();
            if ($inventory) {
              $inventory->delete();
            }
            $variation->delete();
          } else {
            $variation->price = $variationData['price'];
            $variation->save();
          }
        }
      }


      $variations = $request->variations;

      foreach ($variations as $variationData) {
        // Create a new ProductVariation instance
        $variation = ProductVariation::create([
          'color_id' => $variationData['color_id'],
          'price' => $variationData['price'],
          'name' => $variationData['name']
        ]);

        // Generate the 'sku' based on the desired format
        $sku = 'SKU-' . $variation->id . $variationData['color_id'] . implode('', $variationData['attribute_value_ids']);

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
          // $variation->attributeValue()->associate($attwributeValue);
          $variation->attributeValues()->attach($attributeValue);
        }
      }


      return $request;
    } catch (Exception $e) {
      return $request;
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(String $id)
  {
    try {
      $product = Product::where('id', $id)
        ->orWhere('sku', $id)
        ->first();

      if (!$product) {
        $product = ProductVariation::where('id', $id)
          ->orWhere('sku', $id)
          ->first();
      }

      if ($product) {
        $product->delete();
        return response()->noContent();
      }

      return response()->json('No product found', 404);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }
}
