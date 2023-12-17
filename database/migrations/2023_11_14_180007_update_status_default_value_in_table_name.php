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
  public function up()
  {
    Schema::table('product_order_items', function (Blueprint $table) {
      // Change the default value to 'unpaid'
      $table->enum('new_status', ['due', 'unpaid', 'paid', 'cancelled'])->default('unpaid');
    });


    // Copy data from the 'description' column to the 'new_description' column
    DB::statement('UPDATE product_order_items SET new_status = status');

    Schema::table('product_order_items', function (Blueprint $table) {
      $table->dropColumn('status');
      $table->renameColumn('new_status', 'status');
    });
  }

  public function down()
  {

    Schema::table('product_order_items', function (Blueprint $table) {
      // Change the default value to 'unpaid'
      $table->enum('new_status', ['due', 'unpaid', 'paid', 'cancelled'])->default('due');
    });


    // Copy data from the 'description' column to the 'new_description' column
    DB::statement('UPDATE product_order_items SET new_status = status');

    Schema::table('product_order_items', function (Blueprint $table) {
      $table->dropColumn('status');
      $table->renameColumn('new_status', 'status');
    });
  }
};
