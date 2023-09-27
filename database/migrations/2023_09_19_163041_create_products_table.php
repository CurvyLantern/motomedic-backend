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
        // category table migration
        Schema::disableForeignKeyConstraints();
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name', 125);
            $table->string('slug');
            $table->longText('description')->nullable();
            $table->string('image')->nullable();

            $table->unsignedBigInteger('parent_category_id')->nullable();
            $table->foreign('parent_category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');
        });
        Schema::enableForeignKeyConstraints();


        // brand table migration
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->timestamps();


            $table->string('name', 125);
            $table->string('slug');
            $table->string('image')->nullable();
            $table->longText('description')->nullable();
        });

        // attribute table migration
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->integer('priority')->default(0);
            $table->timestamps();
        });

        // attribute_values table migration
        Schema::create('attribute_values', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->unsignedBigInteger('attribute_id');
            $table->foreign('attribute_id')->references('id')->on('attributes')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });


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

            $table->unsignedBigInteger('attribute_id');
            $table->foreign('attribute_id')->references('id')->on('attributes')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('attribute_value_id');
            $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->onUpdate('cascade')->onDelete('cascade');
        });
        // product variation table
        Schema::create(
            'product_variations',
            function (Blueprint $table) {
                $table->id();

                $table->unsignedBigInteger('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onUpdate('cascade')->onDelete('cascade');

                $table->unsignedBigInteger('attribute_id')->nullable();
                $table->foreign('attribute_id')->references('id')->on('product_attributes')->onUpdate('cascade')->onDelete('cascade');


                $table->unsignedBigInteger('color_id')->nullable();
                $table->text('image')->nullable();
                $table->float('price')->nullable();

                $table->unsignedBigInteger('attribute_value_id')->nullable();
                $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->onUpdate('cascade')->onDelete('cascade');
                $table->foreign('color_id')->references('id')->on('colors')->onUpdate('cascade')->onDelete('cascade');

                $table->timestamps();
            }
        );

        // porduct images table
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('media_id');
            $table->foreign('media_id')->references('id')->on('medias')->onUpdate('cascade')->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variations');
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('products');

        Schema::dropIfExists('attributes_values');
        Schema::dropIfExists('attributes');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('categories');
    }
};
