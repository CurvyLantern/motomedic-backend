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

    Schema::create('sellers', function (Blueprint $table) {
      $table->id();
      $table->string('name')->nullable();
      $table->string('phone')->nullable();
      $table->string('email')->nullable();
      $table->string('address')->nullable();
      $table->timestamps();
    });

    Schema::create('inventory_records', function (Blueprint $table) {
      $table->id();

      $table->unsignedBigInteger('inventory_seller_id')->nullable();
      $table->foreign('inventory_seller_id')
        ->references('id')
        ->on('sellers')
        ->onUpdate('cascade');

      $table->enum('type', ['buying', 'selling'])->default('buying');

      $table->unsignedDecimal('inventory_total_cost')->default(0);
      $table->unsignedDecimal('inventory_total_due')->default(0);
      $table->json('purchased_products');
      $table->timestamps();
    });

    Schema::create('inventories', function (Blueprint $table) {
      $table->id();
      $table->timestamps();

      $table->unsignedInteger('stock_count')->default(0);
      $table->string('sku')->unique();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('inventories');
    Schema::dropIfExists('inventory_records');
    Schema::dropIfExists('sellers');
  }
};
