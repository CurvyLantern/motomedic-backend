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
        $queue = 1;
        return [
            'customerId' => Customer::select('id')->inRandomOrder()->first()->id,
            'serviceId' => Service::select('id')->inRandomOrder()->first()->id,
            'productId' => Product::select('id')->inRandomOrder()->first()->id,
            'subtotal' => rand(500, 18000), // Generates a random image URL
            'total' => rand(1200, 35000),
            'quantity' => rand(1, 10),
            'queue' => $queue++,

        ];
    }
}
