<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

  public function up()
  {
    Schema::table('service_order_items', function (Blueprint $table) {
      $table->enum('tax_type', ['flat', 'percent'])->default('flat');
      $table->enum('discount_type', ['flat', 'percent'])->default('flat');
    });
  }

  public function down()
  {
    Schema::table('service_order_items', function (Blueprint $table) {
      $table->dropColumn(['tax_type', 'discount_type']);
    });
  }
};
