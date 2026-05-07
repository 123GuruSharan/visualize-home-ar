<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['Eames Lounge Chair', 'Chair', 2499.00, 84, 82, 84],
            ['Velvet Curve Sofa',  'Sofa',  3899.00, 220, 78, 92],
            ['Oak Dining Table',   'Table', 1599.00, 200, 75, 90],
            ['Linen Platform Bed', 'Bed',   2199.00, 180, 95, 210],
        ];

        foreach ($items as [$name, $cat, $price, $w, $h, $d]) {
            Product::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name'        => $name,
                    'category'    => $cat,
                    'price'       => $price,
                    'description' => "$name — premium $cat designed for modern living.",
                    'image_path'  => "products/" . Str::slug($name) . ".jpg",
                    'model_path'  => "models/"   . Str::slug($name) . ".glb",
                    'width'       => $w,
                    'height'      => $h,
                    'depth'       => $d,
                ]
            );
        }
    }
}
