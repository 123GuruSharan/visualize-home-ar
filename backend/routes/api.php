<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Maison Furniture AR
|--------------------------------------------------------------------------
*/

// Public catalog
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

// Cart (guest-friendly via session_id, or authenticated via Sanctum)
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::patch('/cart/{item}', [CartController::class, 'update']);
Route::delete('/cart/remove/{item}', [CartController::class, 'remove']);

// Auth — Sanctum SPA flow
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user',    fn (Request $r) => $r->user());
    Route::post('/logout', [AuthController::class, 'logout']);
});
