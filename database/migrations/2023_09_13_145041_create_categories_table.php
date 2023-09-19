<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::disableForeignKeyConstraints();

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();


            $table->string('name', 125);
            $table->string('slug');
            $table->longText('description')->nullable();
            $table->string('image')->nullable();

            $table->unsignedBigInteger('parent_category_id')->nullable();
            $table->foreign('parent_category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');
        });

        // Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
