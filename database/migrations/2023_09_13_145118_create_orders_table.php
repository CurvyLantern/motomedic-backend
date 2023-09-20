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
        // Schema::create('orders', function (Blueprint $table) {
        //     $table->id();


        //     $table->unsignedBigInteger('customerId');
        //     $table->foreign('customerId')->references('id')->on('customers')->onUpdate('cascade')->onDelete('cascade');

        //     $table->unsignedBigInteger('serviceId');
        //     $table->foreign('serviceId')->references('id')->on('services')->onUpdate('cascade')->onDelete('cascade');

        //     $table->unsignedBigInteger('productId');
        //     $table->foreign('productId')->references('id')->on('products')->onUpdate('cascade')->onDelete('cascade');

        //     $table->integer('quantity');
        //     $table->float('subtotal');
        //     $table->float('total');
        //     $table->float('tax')->nullable();
        //     $table->float('discount')->nullable();
        //     $table->text('note')->nullable();
        //     $table->integer('extra')->nullable();
        //     $table->enum('serviceStatus', ['Onhold', 'Processing', 'Completed'])->default('Onhold');
        //     $table->enum('status', ['Onhold', 'Processing', 'Completed'])->default('Onhold');
        //     $table->integer('queue');
        //     $table->bigInteger('orderCreator')->nullable();
        //     $table->timestamps();
        // });
        // Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
