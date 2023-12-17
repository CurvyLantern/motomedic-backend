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

    Schema::create('vendors', function (Blueprint $table) {
      $table->id();
      $table->string('name')->nullable();
      $table->string('phone')->nullable();
      $table->string('email')->nullable();
      $table->string('address')->nullable();
      $table->timestamps();
    });

    Schema::create('inventory_records', function (Blueprint $table) {
      $table->id();

      $table->unsignedBigInteger('inventory_updater_id')->nullable();
      $table->foreign('inventory_updater_id')->references('id')->on('users')->cascadeOnUpdate()->nullOnDelete();

      $table->unsignedBigInteger('inventory_vendor_id')->nullable();
      $table->foreign('inventory_vendor_id')
        ->references('id')
        ->on('vendors')
        ->onUpdate('cascade');

      $table->enum('type', ['store_in', 'store_out'])->default('store_in');

      $table->string('product_sku')->nullable();
      $table->integer('quantity')->default(0);
      $table->double('per_unit_cost', 10, 0)->default(0);

      $table->timestamps();
    });

    Schema::create('inventories', function (Blueprint $table) {
      $table->id();
      $table->timestamps();

      $table->unsignedInteger('stock_count')->default(0);
      $table->string('sku')->unique()->nullable();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('inventories');
    Schema::dropIfExists('inventory_records');
    Schema::dropIfExists('vendors');
  }
};
