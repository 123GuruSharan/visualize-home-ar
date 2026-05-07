# Maison Laravel 11 Backend

Real Laravel 11 API powering the Maison furniture AR frontend.

## Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Database (MySQL or sqlite — adjust .env)
php artisan migrate --seed

# Public storage for product images & GLB models
php artisan storage:link

# Run the API
php artisan serve   # http://127.0.0.1:8000
```

Place AR assets under:

```
storage/app/public/products/<slug>.jpg
storage/app/public/models/<slug>.glb
storage/app/public/models/<slug>.usdz   # optional, iOS Quick Look
```

After `storage:link`, they are served at `http://127.0.0.1:8000/storage/...`
and the `Product` model exposes them as `image`, `model`, and `ios_model`.

## API

| Method | Endpoint                    | Description                       |
|--------|-----------------------------|-----------------------------------|
| GET    | `/api/products`             | List products (`?category=Sofa`)  |
| GET    | `/api/products/{id\|slug}`  | Single product                    |
| GET    | `/api/categories`           | Distinct category list            |
| GET    | `/api/cart?session={uuid}`  | Get cart (guest or auth)          |
| POST   | `/api/cart/add`             | `{product_id, quantity, session_id?}` |
| PATCH  | `/api/cart/{item}`          | `{quantity}`                      |
| DELETE | `/api/cart/remove/{item}`   | Remove an item                    |
| POST   | `/api/register`             | `{name, email, password, password_confirmation}` |
| POST   | `/api/login`                | `{email, password}` (Sanctum SPA) |
| POST   | `/api/logout`               | (auth)                            |
| GET    | `/api/user`                 | Current user (auth)               |

## Auth — Sanctum SPA flow

1. `GET /sanctum/csrf-cookie` (sets `XSRF-TOKEN`)
2. `POST /api/login` with `X-XSRF-TOKEN` header
3. Subsequent requests use the `laravel_session` cookie

`config/cors.php` allows the Vite dev origin (`http://localhost:5173`)
with `supports_credentials: true`. The frontend `apiFetch` already sends
`credentials: "include"` and forwards the `XSRF-TOKEN` header.
