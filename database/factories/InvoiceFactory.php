<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_paper_id' => fake()->unique()->numberBetween(50, 500),
            'invoice_seller_id' => Seller::select('id')->inRandomOrder()->first()->id,
            'invoice_total_cost' => fake()->numberBetween(5000, 15000),
            'invoice_total_due' => fake()->numberBetween(500, 1000),
            'purchased_products' => fake()->unique()->numberBetween(1, 20),
        ];
    }
}
