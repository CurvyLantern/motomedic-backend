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
        // Schema::create('customers', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('customerName');
        //     $table->string('email')->unique()->nullable();
        //     $table->timestamp('email_verified_at')->nullable();
        //     $table->string('phone')->unique();
        //     $table->string('verification_code')->unique()->nullable();
        //     $table->timestamp('phone_verified_at')->nullable();
        //     $table->string('password');

        //     $table->unsignedBigInteger('userDetailsId')->nullable();
        //     $table->foreign('userDetailsId')->references('id')->on('user_details')->onUpdate('cascade')->onDelete('cascade');

        //     $table->string('bikeInfo')->nullable();

        //     $table->tinyInteger('status')->default(0);
        //     $table->rememberToken();
        //     $table->timestamps();
        // });
        // Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
