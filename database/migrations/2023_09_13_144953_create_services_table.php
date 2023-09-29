<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void{

        Schema::create('mechanics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique();
            $table->text('address')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });


         Schema::create('services', function (Blueprint $table) {
             $table->id();
             $table->string('name');
             $table->string('slug')->nullable();
             $table->string('type')->default('service');
             $table->string('service_type')->nullable();
             $table->string('job_number')->nullable();
             $table->unsignedBigInteger('customer_id');
             $table->text('problem_details')->nullable();
             $table->unsignedBigInteger('mechanic_id');
             $table->float('price');
             $table->json('items')->nullable();
             $table->string('elapsed_time');
             $table->text('note')->nullable();
             $table->enum('status', ['start','progressing', 'running','delayed','cancelled'])->default('start');

             $table->foreign('mechanic_id')->references('id')->on('mechanics')->onUpdate('cascade');
             $table->foreign('customer_id')->references('id')->on('mechanics')->onUpdate('cascade');
             $table->timestamps();
         });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
        Schema::dropIfExists('mechanics');
    }
};
