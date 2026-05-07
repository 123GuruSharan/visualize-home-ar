<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /** Resolve (or create) the active cart for this request. */
    protected function resolveCart(Request $request): Cart
    {
        if ($user = $request->user()) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        $sessionId = $request->input('session_id') ?? $request->query('session');
        abort_unless($sessionId, 400, 'session_id is required for guest carts.');

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    protected function format(Cart $cart): array
    {
        $cart->load('items.product');

        return [
            'id'       => $cart->id,
            'items'    => $cart->items->map(fn (CartItem $i) => [
                'id'       => $i->id,
                'quantity' => $i->quantity,
                'product'  => $i->product,
            ]),
            'subtotal' => $cart->subtotal(),
        ];
    }

    /** GET /api/cart */
    public function index(Request $request): JsonResponse
    {
        return response()->json($this->format($this->resolveCart($request)));
    }

    /** POST /api/cart/add */
    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity'   => ['nullable', 'integer', 'min:1'],
        ]);

        $cart = $this->resolveCart($request);
        $qty  = $data['quantity'] ?? 1;

        $item = $cart->items()->where('product_id', $data['product_id'])->first();
        if ($item) {
            $item->increment('quantity', $qty);
        } else {
            $cart->items()->create([
                'product_id' => $data['product_id'],
                'quantity'   => $qty,
            ]);
        }

        return response()->json($this->format($cart->fresh()));
    }

    /** PATCH /api/cart/{item} */
    public function update(Request $request, CartItem $item): JsonResponse
    {
        $data = $request->validate(['quantity' => ['required', 'integer', 'min:1']]);
        $item->update(['quantity' => $data['quantity']]);

        return response()->json($this->format($item->cart));
    }

    /** DELETE /api/cart/remove/{item} */
    public function remove(CartItem $item): JsonResponse
    {
        $cart = $item->cart;
        $item->delete();

        return response()->json($this->format($cart->fresh()));
    }
}
