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
    Schema::table('order_items', function (Blueprint $table) {
      // Add a check constraint to ensure only one of 'product_id' and 'service_id' is not null
      DB::statement('ALTER TABLE order_items ADD CONSTRAINT product_service_xor_check CHECK ((product_id IS NULL) != (service_id IS NULL))');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('order_items', function (Blueprint $table) {
      DB::statement('ALTER TABLE order_items DROP CONSTRAINT product_service_xor_check');
    });
  }
};
