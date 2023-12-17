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
    Schema::table('service_type_products', function (Blueprint $table) {
      $table->string('new_description')->default('');
    });

    // Copy data from the 'description' column to the 'new_description' column
    DB::statement('UPDATE service_type_products SET new_description = description');

    Schema::table('service_type_products', function (Blueprint $table) {
      $table->dropColumn('description');
      $table->renameColumn('new_description', 'description');
    });
  }

  public function down()
  {
    Schema::table('service_type_products', function (Blueprint $table) {
      $table->longText('new_description');
    });

    DB::statement('UPDATE service_type_products SET new_description = description');

    Schema::table('service_type_products', function (Blueprint $table) {
      $table->dropColumn('description');
      $table->renameColumn('new_description', 'description');
    });
  }
};
