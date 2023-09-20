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
        // Schema::create('user_details', function (Blueprint $table) {
        //     $table->id();
        //     $table->date('birthdate')->nullable();
        //     $table->string('img')->nullable();
        //     $table->string('city');
        //     $table->integer('postCode');
        //     $table->text('street');
        //     $table->text('SpecialInstructions');
        //     $table->string('country')->default('bangladesh');
        //     $table->timestamps();
        // });
        // Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_details');
    }
};
