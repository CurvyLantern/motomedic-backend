<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up()
  {
    Schema::create('product_attribute_values', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('product_variation_id');
      $table->unsignedBigInteger('attribute_value_id');
      $table->timestamps();

      $table->foreign('product_variation_id')->references('id')->on('product_variations')->onUpdate('cascade')->onDelete('cascade');
      $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->onUpdate('cascade')->onDelete('cascade');
    });
  }


  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_attribute_values');
  }
};
