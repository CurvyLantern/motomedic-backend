<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {

    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('customer_id');
      $table->foreign('customer_id')->references('id')->on('customers')->onUpdate('cascade');
      $table->double('total');
      $table->double('discount')->nullable();
      $table->double('tax')->default(0);
      $table->text('note')->nullable();
      $table->enum('status', ['Onhold', 'Processing', 'Completed'])->default('Onhold');


      $table->timestamps();
    });

    Schema::create('order_items', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('order_id');
      $table->unsignedBigInteger('product_id')->nullable();
      $table->unsignedBigInteger('service_id')->nullable();
      $table->integer('quantity')->default(1);


      $table->enum('type', ['product', 'service'])->default('product');
      $table->enum('status', ['running', 'onhold', 'completed'])->default('running');


      $table->decimal('total_price', 10, 2)->default(0.00);
      $table->decimal('unit_price', 10, 2)->default(0.00);


      $table->timestamps();

      $table->foreign('order_id')->references('id')->on('orders')->onUpdate('cascade')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onUpdate('cascade');
      $table->foreign('service_id')->references('id')->on('services')->onUpdate('cascade');
    });

    // Add a raw XOR constraint
    DB::statement('ALTER TABLE order_items ADD CONSTRAINT product_service_xor_check CHECK ((product_id IS NULL) != (service_id IS NULL))');
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
  }
};
