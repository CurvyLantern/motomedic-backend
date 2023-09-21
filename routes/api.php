<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// custom controllers
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductAttributeController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\AttributeValueController;
use App\Http\Controllers\ProductVariationController;
use App\Http\Resources\UserResource;
use PhpParser\Node\Scalar\MagicConst\Dir;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('v1')->group(function () {
        Route::get('user', function (Request $request) {
            $user =  $request->user();

            return new UserResource($user);
        });

        Route::apiResource('brands', BrandController::class);
        Route::apiResource('categories', CategoryController::class);
        // Route::apiResources([
        //     'categories' => CategoryController::class,
        //     'brands' => BrandController::class
        // ]);
    });
});


// new api v1
/* Route::prefix('v1')->group(function () {


    // Route::get('/customers', [CustomerController::class, 'allCustomer'])->name('admin.allCustomer');
    // Route::post('/customer/create', [CustomerController::class, 'addCustomer'])->name('admin.addCustomer');
    // Route::delete('/customer/{id}', [CustomerController::class, 'deleteCustomer'])->name('admin.deleteCustomer');
    // Route::put('/customer/{id}', [CustomerController::class, 'editCustomer'])->name('admin.editCustomer');

    Route::apiResource('customers', CustomerController::class)->except(['create', 'edit'])->only(['']);

    Route::get('/customer-details/{id}', [CustomerController::class, 'customerDetails'])->name('admin.customerDetails');

    // Customer management route for customer ends here ...


    // Service management routes for admin

    Route::prefix('service')->group(function () {

        Route::get('/all', [ServiceController::class, 'index'])->name('services');
        Route::get('/{id}', [ServiceController::class, 'show'])->name('service.show');
        Route::post('/create', [ServiceController::class, 'create'])->name('service.create');
        Route::put('/{id}', [ServiceController::class, 'update'])->name('service.edit');
        Route::delete('/{id}', [ServiceController::class, 'destroy'])->name('service.delete');
    });


    // Service management routes for admin ends

    // Products management routes for admin start

    Route::prefix('product')->group(function () {

        Route::get('/all', [ProductController::class, 'index'])->name('products');
        Route::get('/{id}', [ProductController::class, 'show'])->name('product.show');
        // Route::get('/add-product',[ProductController::class,'create'])->name('product.create'); // use store route instead of this route
        Route::post('/create', [ProductController::class, 'store'])->name('product.store');
        //    Route::put('product/{id}',[ProductController::class,'update'])->name('product.update');
        Route::delete('/{id}', [ProductController::class, 'destroy'])->name('product.destroy');

        Route::get('variation/{id}', [ProductController::class, 'productVariation'])->name('product.variation');
    });

    // Products management routes for admin ends


    // Products Categoty management routes for admin starts

    Route::prefix('category')->group(function () {

        Route::get('all', [CategoryController::class, 'index'])->name('categories');
        Route::get('/{id}', [CategoryController::class, 'show'])->name('category.show');
        Route::post('/create', [CategoryController::class, 'create'])->name('category.create');
        Route::put('/{id}', [CategoryController::class, 'update'])->name('category.update');
        Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');
        Route::get('/{id}/products', [CategoryController::class, 'categoryProducts'])->name('category.products');
    });


    // Brands CRUD routes...................

    Route::prefix('brand')->group(function () {
        Route::get('/all', [BrandController::class, 'index'])->name('brands');
        Route::get('/{id}', [BrandController::class, 'show'])->name('brand.show');
        Route::post('/create', [BrandController::class, 'store'])->name('brand.create');
        Route::put('/{id}', [BrandController::class, 'update'])->name('brand.update');
        Route::delete('/{id}', [BrandController::class, 'destroy'])->name('brand.destroy');
        Route::get('/{id}/products', [BrandController::class, 'brandProducts'])->name('brand.products');
        // Route::post('testBrand',[BrandController::class,'testBrand'])->name('brand.testBrand');
    });
    //    Route::get('brand/all/{id}',[BrandController::class,'nasim'])->name('nasim');

    // Orders CRUD routes...................

    Route::prefix('order')->group(function () {

        Route::get('all', [OrderController::class, 'index'])->name('orders');
        Route::get('/{id}', [OrderController::class, 'show'])->name('order.show');
        Route::post('/create', [OrderController::class, 'create'])->name('order.create');
        Route::put('/{id}', [OrderController::class, 'update'])->name('order.edit');
        Route::delete('/{id}', [OrderController::class, 'destroy'])->name('order.delete');
    });


    // Route::get('order/{id}/products',[OrderController::class,'brandProducts'])->name('order.products');


    // Product attributes routes ............


    Route::prefix('product-attribute')->group(function () {

        Route::get('all', [ProductAttributeController::class, 'index'])->name('productAttributes');
        Route::get('/{id}', [ProductAttributeController::class, 'show'])->name('productAttribute.show');
        Route::post('/create', [ProductAttributeController::class, 'store'])->name('productAttribute.create');
        Route::put('/{id}', [ProductAttributeController::class, 'update'])->name('productAttribute.edit');
        Route::delete('/{id}', [ProductAttributeController::class, 'destroy'])->name('productAttribute.delete');
    });

    Route::prefix('product-variation')->group(function () {

        Route::get('all', [ProductVariationController::class, 'index'])->name('attributes');
        Route::get('/{id}', [ProductVariationController::class, 'show'])->name('attribute.show');
        Route::post('/create', [ProductVariationController::class, 'store'])->name('attribute.create');
        Route::put('/{id}', [ProductVariationController::class, 'update'])->name('attribute.edit');
        Route::delete('/{id}', [ProductVariationController::class, 'destroy'])->name('attribute.delete');
    });

    // Admin middleware controll routes ................

}); */












//.........................API version v2


Route::prefix('v2')->group(function () {


//
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('categories', CategoryController::class);

//    Route::get('brand/create',[BrandController::class,'store'])->name('brand.create');


});
