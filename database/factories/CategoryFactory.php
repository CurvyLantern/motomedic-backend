<?php

namespace Database\Factories;

use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categoryName = fake()->userName;
        return [
            'categoryName' => $categoryName,
            'slug' => Str::slug($categoryName, '-'),
            'img' => $this->faker->imageUrl(200, 200), // Generates a random image URL
            'description' => $this->faker->sentence,
            'parentCategoryId' => $this->faker->numberBetween(1, 5),
        ];
    }
}
