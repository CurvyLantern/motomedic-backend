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
      $table->decimal('total_price', 10, 2)->default(0.00);
      $table->decimal('unit_price', 10, 2)->default(0.00);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('order_items', function (Blueprint $table) {
      $table->dropColumn('total_price');
      $table->dropColumn('unit_price');
    });
  }
};
