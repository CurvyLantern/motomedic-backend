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
        Schema::disableForeignKeyConstraints();
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('productName');
            $table->string('slug');

            $table->unsignedBigInteger('categoryId')->nullable();
            $table->foreign('categoryId')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('brandId')->nullable();
            $table->foreign('brandId')->references('id')->on('brands')->onUpdate('cascade')->onDelete('cascade');


            $table->string('sku')->nullable();
            $table->string('model')->nullable();
            $table->string('color')->nullable();
            $table->string('material')->nullable();
            $table->string('size')->nullable();
            $table->year('year')->nullable();
            $table->string('compitibility')->nullable();
            $table->string('condition')->nullable();
            $table->string('weight');
            $table->integer('quantity');
            $table->float('price');
            $table->float('discount')->nullable();
            $table->enum('discountType', ['fixed', 'percentage'])->nullable();
            $table->string('primaryImg');

            $table->unsignedBigInteger('thumbImgId')->nullable();
            $table->foreign('thumbImgId')->references('id')->on('media_images')->onUpdate('cascade')->onDelete('cascade');

            $table->text('shortDescriptions');
            $table->boolean('availability')->default(true);
            $table->text('note')->nullable();
            $table->longText('longDescriptions')->nullable();
            $table->longText('installationMethod')->nullable();
            $table->string('warranty')->nullable();
            $table->string('manufacturerPartNumber')->nullable();
            $table->float('rating')->nullable();
            $table->bigInteger('reviewsId')->nullable();
            $table->tinyInteger('status');
            $table->enum('productType', ['simpleProduct', 'variationProduct'])->default('simpleProduct');
            $table->text('attributesData')->nullable();

            $table->unsignedBigInteger('attribiuteId')->nullable();
            $table->foreign('attribiuteId')->references('id')->on('attribiutes')->onUpdate('cascade')->onDelete('cascade');

            $table->string('manufacturer')->nullable();
            $table->bigInteger('productCreator')->nullable();
            $table->timestamps();
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
