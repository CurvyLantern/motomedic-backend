<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Mechanic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);

        // Get product IDs from the products table
        $productIds = DB::table('products')->pluck('id')->toArray();

        // Create an array of random product IDs
        $itemData = [];
        $numberOfProducts = $this->faker->numberBetween(1, 5); // You can adjust the range as needed
        for ($i = 0; $i < $numberOfProducts; $i++) {
          $itemData[] = ['product_id' => $this->faker->randomElement($productIds)];
        }

        return [
            'name' => $name,
            'slug' => Str::slug($name, '-'),
            'type' => 'service',
            'service_type' => fake()->sentence(),
            'job_number' => fake()->unique()->numberBetween(1, 1000),
            'price' => fake()->randomFloat(2, 600, 2000),
            'elapsed_time' => fake()->numberBetween(1, 8),
            'problem_details' => fake()->sentence,
            'items' => json_encode($itemData),
            'note' => fake()->sentence,
            'status' => fake()->randomElement(['start','progressing', 'running','delayed','cancelled']),
            'mechanic_id' => Mechanic::select('id')->inRandomOrder()->first()->id,
            'customer_id' => Customer::select('id')->inRandomOrder()->first()->id,
        ];
    }
}
