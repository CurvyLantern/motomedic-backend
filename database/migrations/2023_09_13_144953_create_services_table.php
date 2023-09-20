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

        // Schema::create('services', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('serviceName');
        //     $table->string('slug');
        //     $table->text('description')->nullable();
        //     $table->string('img')->nullable();
        //     $table->float('price');
        //     $table->integer('durationHours');
        //     $table->boolean('status')->default(true);
        //     $table->boolean('featured')->default(true);
        //     $table->unsignedBigInteger('serviceCreator')->nullable();
        //     //$table->bigInteger('category');
        //     //$table->foreign('category')->references('id')->on('service_categories');
        //     $table->text('note')->nullable();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
