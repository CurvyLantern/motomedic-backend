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
    Schema::table('orders', function (Blueprint $table) {
      $table->renameColumn('discount', 'overallDiscount');
      $table->renameColumn('tax', 'overallTax');
      $table->enum('overallDiscountType', ['flat', 'percent'])->default('percent');
      $table->enum('overallTaxType', ['flat', 'percent'])->default('percent');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->renameColumn('overallDiscount', 'discount');
      $table->renameColumn('overallTax', 'tax');
      $table->dropColumn(['overallDiscountType', 'overallTaxType']);
    });
  }
};
