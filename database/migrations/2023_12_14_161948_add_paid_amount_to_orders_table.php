<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->decimal('paid_amount', 10, 2, true)->after('total_price');
    });

    // Adding a check constraint using raw SQL
    DB::statement('ALTER TABLE orders ADD CONSTRAINT check_paid_amount CHECK (paid_amount <= total_price)');
  }


  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->dropColumn('paid_amount');
    });
  }
};
