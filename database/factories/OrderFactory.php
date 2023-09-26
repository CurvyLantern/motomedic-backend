<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::select('id')->inRandomOrder()->first()->id,
            'total' => fake()->numberBetween(1500,5000),
            'discount' => fake()->numberBetween(500,1200),
            'tax' => fake()->numberBetween(10,100), // Generates a random image URL
            'note' => fake()->sentence(),
            'status' => fake()->randomElement(['Onhold','Processing','Completed']),
        ];
    }
}
