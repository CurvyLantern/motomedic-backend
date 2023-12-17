<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('prices', function (Blueprint $table) {
      $table->double('buying_price', 10, 2)->default(0.00)->change();
      $table->double('selling_price', 10, 2)->default(0.00)->change();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('prices', function (Blueprint $table) {
      $table->double('buying_price', 10, 2)->nullable()->change();
      $table->double('selling_price', 10, 2)->nullable()->change();
    });
  }
};
