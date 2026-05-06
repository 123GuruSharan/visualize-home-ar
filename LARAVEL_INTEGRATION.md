# Laravel Integration Guide

This frontend is a standalone Vite + React + TypeScript app architected to be
served by, or consumed from, a Laravel backend.

## Architecture

```
src/
├── api/                  ← Laravel API client layer
│   ├── client.ts         ← fetch wrapper, Sanctum CSRF, ApiError
│   ├── products.ts       ← GET /products, /products/{id}, /categories
│   ├── cart.ts           ← GET/POST/PATCH/DELETE /cart
│   └── auth.ts           ← Sanctum login/register/logout/user
├── context/
│   ├── ar.ts             ← AR modal trigger (unchanged)
│   └── cart.tsx          ← Cart state — calls api/cart, falls back to localStorage
├── hooks/
│   └── useProducts.ts    ← useProducts(), useProduct(id) — loading/error
├── data/
│   ├── products.ts       ← Compatibility shim, re-exports api + types
│   └── fallback.ts       ← Local sample dataset (preview without backend)
├── types/
│   └── product.ts        ← Product, CartItem, CartSummary
└── pages/                ← UI unchanged, now consumes hooks/api
```

## Environment

Copy `.env.example` → `.env` and adjust:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_API_ORIGIN=http://127.0.0.1:8000
VITE_USE_FALLBACK_DATA=true   # set "false" once backend is live
```

## Expected Laravel endpoints

| Method | Path                       | Purpose                           |
|--------|----------------------------|-----------------------------------|
| GET    | /api/products              | List products                     |
| GET    | /api/products/{id}         | Product detail                    |
| GET    | /api/categories            | Category list                     |
| GET    | /api/cart?session={uuid}   | Guest cart                        |
| POST   | /api/cart                  | `{session_id, product_id, qty}`   |
| PATCH  | /api/cart/{id}             | `{quantity}`                      |
| DELETE | /api/cart/{id}             | Remove line                       |
| GET    | /sanctum/csrf-cookie       | Sanctum CSRF cookie               |
| POST   | /api/login, /api/register  | Sanctum SPA auth                  |
| POST   | /api/logout                |                                   |
| GET    | /api/user                  | Current user                      |

A ready-made Laravel 11 starter implementing these is shipped separately
(`maison-laravel-api.zip`).

## Deploying inside Laravel

Two common options:

### 1. Vite-in-Laravel (recommended)
- Move `src/`, `index.html`, `tailwind.config.ts`, `postcss.config.js`,
  `tsconfig*.json`, and `vite.config.ts` into your Laravel project's
  `resources/js/` (and adjust paths).
- Use Laravel's official `laravel-vite-plugin` so Blade can `@vite()` the
  bundle. Mount the React app in a Blade template (`<div id="root"></div>`).
- Same-origin requests mean cookies / Sanctum work without CORS gymnastics.

### 2. Standalone SPA + Laravel API
- Keep this Vite app deployed separately (Vercel/Netlify/static host).
- Configure `config/cors.php` and Sanctum's `stateful` domains to include
  the SPA origin. Set `VITE_API_BASE_URL` to your Laravel domain.

### 3. Inertia.js
- Replace `react-router-dom` routes with Inertia pages. Pages already use
  hooks/api boundaries, so the swap is mechanical — keep `components/`,
  `context/`, and `api/` as-is.

## AR

`<model-viewer>` and the AR modal are untouched. Product `model` (GLB) and
`iosModel` (USDZ) URLs are returned by the API.
