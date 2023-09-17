<?php

namespace Database\Factories;

use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brandName' => fake()->company,
            'slug' => Str::slug(fake()->unique()->company, '-'),
            'img' => fake()->imageUrl(200, 200), // Generates a random image URL
            'description' => fake()->paragraph,
        ];
    }
}
