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
    Schema::table('product_order_items', function (Blueprint $table) {
      $table->enum('discount_type', ['flat', 'percent'])->default('flat');
      $table->enum('tax_type', ['flat', 'percent'])->default('flat');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('product_order_items', function (Blueprint $table) {
      $table->dropColumn(['discount_type', 'tax_type']);
    });
  }
};
