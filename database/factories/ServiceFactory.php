<?php

namespace Database\Factories;

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
        $serviceName = fake()->words(3, true);

        return [
            'serviceName' => $serviceName,
            'slug' => Str::slug($serviceName, '-'),
            'description' => fake()->paragraph,
            'img' => fake()->imageUrl(200, 200),
            'price' => fake()->randomFloat(2, 600, 2000),
            'durationHours' => fake()->numberBetween(1, 8),
            'status' => fake()->numberBetween(0, 1),
            'featured' => fake()->boolean(),
            'note' => fake()->sentence,
        ];
    }
}
