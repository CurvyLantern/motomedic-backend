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
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->unique()->change();

            $table->string('sku')->unique()->change();

            $table->unsignedBigInteger('color_id')->nullable();
            $table->foreign('color_id')->references('id')->on('colors')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Revert the 'sku' column to nullable
            $table->string('sku')->nullable()->change();

            // Remove the foreign key constraint on 'color_id'
            $table->dropForeign(['color_id']);

            // If you want to remove the 'color_id' column completely, you can do it here:
            $table->dropColumn('color_id');

            $table->dropUnique('products_slug_unique');
        });
    }
};
