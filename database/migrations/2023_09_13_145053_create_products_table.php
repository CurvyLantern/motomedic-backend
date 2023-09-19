<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::disableForeignKeyConstraints();
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');

            $table->unsignedBigInteger('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');


            $table->unsignedBigInteger('brand_id')->nullable();
            $table->foreign('brand_id')->references('id')->on('brands')->onUpdate('cascade')->onDelete('cascade');


            $table->string('sku')->nullable();
            $table->string('model')->nullable();

            $table->unsignedBigInteger('color_id')->nullable();
            $table->foreign('color_id')->references('id')->on('colors')->onUpdate('cascade')->onDelete('cascade');

            $table->string('material')->nullable();
            $table->string('weight');
            $table->decimal('price');

            $table->longText('description')->nullable();
            $table->string('warranty')->nullable();
            $table->boolean('status');

            $table->timestamps();
        });
        // Schema::enableForeignKeyConstraints();

        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();


            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('attribute_value_id');
            $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_attributes');
    }
};
