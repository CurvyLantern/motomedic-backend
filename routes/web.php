<?php

use App\Http\Controllers\CsrfController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

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

Route::get('/logs', function () {
    $logContent = file_get_contents(storage_path('logs/laravel.log'));

    // You can also parse and format the log content as needed

    return '<pre>' . e($logContent) . '</pre>';
});


Route::prefix('v1')->group(function () {
    Route::get('csrf', [CsrfController::class, 'show'])->name('csrf');
    Route::prefix('auth')->group(function () {
        require __DIR__ . '/auth.php';
    });
});
