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

      $table->unsignedBigInteger('seller_id');
      $table->foreign('seller_id')->references('id')->on('users')->onUpdate('cascade');

      $table->text('note')->nullable();
      $table->enum('status', ['paid', 'unpaid', 'cancelled'])->default('unpaid');

      $table->double('total_price', 10, 2)->default(0.00);
      $table->integer('discount')->default(0);
      $table->integer('tax')->default(0);


      $table->timestamps();
    });

    Schema::create('service_order_items', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('order_id');
      $table->foreign('order_id')->references('id')->on('orders')->cascadeOnUpdate()->cascadeOnDelete();

      $table->unsignedBigInteger('service_type_id')->nullable();
      $table->foreign('service_type_id')->references('id')->on('service_types')->cascadeOnUpdate()->nullOnDelete();

      $table->unsignedBigInteger('seller_id')->nullable();
      $table->foreign('seller_id')->references('id')->on('users')->onUpdate('cascade')->nullOnDelete();

      $table->longText('problem_details')->nullable();


      $table->enum('status', ['waiting', 'running', 'completed', 'cancelled'])->default('waiting');

      $table->timestamp('service_started_at')->nullable()->default(null);
      $table->timestamp('service_finished_at')->nullable()->default(null);


      $table->double('total_price', 10, 2)->default(0);
      $table->double('unit_price', 10, 2)->default(0.00);
      $table->integer('tax')->default(0);
      $table->integer('discount')->default(0);



      $table->timestamps();
    });

    Schema::create('service_order_mechanics', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('service_order_items_id');
      $table->foreign('service_order_items_id')->references('id')->on('service_order_items')->cascadeOnUpdate()->cascadeOnDelete();

      $table->unsignedBigInteger('mechanic_id')->nullable();
      $table->foreign('mechanic_id')->references('id')->on('mechanics')->cascadeOnUpdate()->nullOnDelete();

      $table->timestamp('finished_at')->nullable()->default(null);
      $table->timestamps();
    });

    Schema::create('product_order_items', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('order_id');
      $table->foreign('order_id')->references('id')->on('orders')->cascadeOnUpdate()->cascadeOnDelete();

      $table->string('product_sku')->default('');

      $table->enum('type', ['single', 'variation'])->default('single');

      $table->unsignedBigInteger('seller_id')->nullable();
      $table->foreign('seller_id')->references('id')->on('users')->onUpdate('cascade')->nullOnDelete();



      $table->enum('status', ['due', 'unpaid', 'paid', 'cancelled'])->default('due');


      $table->integer('quantity')->default(1);
      $table->double('total_price', 10, 2)->default(0.00);
      $table->double('unit_price', 10, 2)->default(0.00);
      $table->integer('tax')->default(0);
      $table->integer('discount')->default(0);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_order_items');
    Schema::dropIfExists('service_order_mechanics');
    Schema::dropIfExists('service_order_items');
    Schema::dropIfExists('orders');
  }
};
