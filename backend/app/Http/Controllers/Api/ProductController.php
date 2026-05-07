<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /** GET /api/products */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        if ($search = $request->query('q')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('name')->get());
    }

    /** GET /api/products/{product} — accepts numeric id or slug */
    public function show(string $product): JsonResponse
    {
        $model = Product::where('id', $product)
            ->orWhere('slug', $product)
            ->firstOrFail();

        return response()->json($model);
    }

    /** GET /api/categories */
    public function categories(): JsonResponse
    {
        return response()->json(
            Product::query()->select('category')->distinct()->pluck('category')
        );
    }
}
