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

    Schema::create('mechanics', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('email')->unique()->nullable();
      $table->string('phone')->unique();
      $table->text('address')->nullable();
      $table->enum('status', ['idle', 'busy', 'absent'])->default('idle');
      $table->timestamps();
    });
    Schema::create('service_types', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->double('price', 10, 2)->default(0);
      $table->string('description');
      $table->timestamps();
    });

    Schema::create('service_type_products', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('service_type_id');
      $table->foreign('service_type_id')->references('id')->on('service_types')->cascadeOnUpdate()->cascadeOnDelete();

      $table->string('product_sku');
      $table->integer('quantity')->default(0);
      $table->longText('description');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('service_type_products');
    Schema::dropIfExists('service_types');
    Schema::dropIfExists('mechanics');
  }
};
