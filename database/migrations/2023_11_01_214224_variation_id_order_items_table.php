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
    Schema::table('order_items', function (Blueprint $table) {
      $table->unsignedBigInteger('variation_id')->nullable();
      $table->foreign('variation_id')->references('id')->on('product_variations')->onUpdate('cascade')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('order_items', function (Blueprint $table) {
      $table->dropColumn('variation_id');
      $table->dropForeign(['variation_id']);
    });
  }
};
