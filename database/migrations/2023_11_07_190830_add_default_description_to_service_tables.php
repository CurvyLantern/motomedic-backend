<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  public function up()
  {
    DB::statement("ALTER TABLE service_types ALTER COLUMN description SET DEFAULT 'Default description'");
    DB::statement("ALTER TABLE service_type_products ALTER COLUMN description SET DEFAULT 'Default description'");
  }

  public function down()
  {
    DB::statement("ALTER TABLE service_types ALTER COLUMN description DROP DEFAULT");
    DB::statement("ALTER TABLE service_type_products ALTER COLUMN description DROP DEFAULT");
  }
};
