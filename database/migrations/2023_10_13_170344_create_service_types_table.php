<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceTypesTable extends Migration
{
  public function up()
  {
    Schema::create('service_types', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->double('price', 10, 2); // 10 digits in total, 2 after the decimal point
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::dropIfExists('service_types');
  }
}
