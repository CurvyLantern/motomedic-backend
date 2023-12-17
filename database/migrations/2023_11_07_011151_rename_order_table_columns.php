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
      $table->renameColumn('overallDiscount', 'overall_discount');
      $table->renameColumn('overallTax', 'overall_tax');
      $table->renameColumn('overallDiscountType', 'overall_discount_type');
      $table->renameColumn('overallTaxType', 'overall_tax_type');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->renameColumn('overall_discount', 'overallDiscount');
      $table->renameColumn('overall_tax', 'overallTax');
      $table->renameColumn('overall_discount_type', 'overallDiscountType');
      $table->renameColumn('overall_tax_type', 'overallTaxType');
    });
  }
};
