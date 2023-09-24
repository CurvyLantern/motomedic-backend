<?php

use App\Http\Controllers\CsrfController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;


use App\Http\Controllers\BrandController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::prefix('v1')->group(function () {
    Route::get('csrf', [CsrfController::class, 'show'])->name('csrf');
    Route::prefix('auth')->group(function () {
        require __DIR__ . '/auth.php';
    });
});


Route::get('api-test-page',[BrandController::class,'apiTestPage'])->name('api.test.page');
