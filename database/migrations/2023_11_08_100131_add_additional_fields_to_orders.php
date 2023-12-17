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
    Schema::table('orders', function (Blueprint $table) {
      $table->enum('time_status', ['waiting', 'running', 'finished'])->default('waiting');
      $table->enum('payment_status', ['paid', 'unpaid', 'cancelled'])->default('unpaid');
      $table->timestamp('started_at')->nullable()->default(null);
      $table->timestamp('finished_at')->nullable()->default(null);
    });
  }

  public function down()
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->dropColumn(['time_status', 'payment_status', 'started_at', 'finished_at']);
    });
  }
};
