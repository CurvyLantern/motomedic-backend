<?php

namespace Database\Factories;

use App\Models\Mechanic;
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
            'name' => $serviceName,
            'slug' => Str::slug($serviceName, '-'),
            'description' => fake()->paragraph,
            'price' => fake()->randomFloat(2, 600, 2000),
            'duration' => fake()->numberBetween(1, 8),
            'note' => fake()->sentence,
            'mechanic_id' => Mechanic::select('id')->inRandomOrder()->first()->id,
        ];
    }
}
