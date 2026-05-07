<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->string('category');
            $t->decimal('price', 10, 2);
            $t->text('description')->nullable();

            // Storage paths inside storage/app/public
            $t->string('image_path')->nullable();
            $t->string('model_path')->nullable();      // .glb
            $t->string('ios_model_path')->nullable();  // .usdz

            $t->unsignedInteger('width')->default(0);
            $t->unsignedInteger('height')->default(0);
            $t->unsignedInteger('depth')->default(0);

            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
