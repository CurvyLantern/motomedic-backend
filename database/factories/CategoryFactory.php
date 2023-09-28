<?php

namespace Database\Factories;

use App\Models\Category;
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
        $name = fake()->domainName();
        return [
            'name' => $name,
            'slug' => Str::slug($name, '-'),
            'image' => $this->faker->imageUrl(200, 200), // Generates a random image URL
            'description' => $this->faker->sentence,
//            'parent_category_id' => Category::select('id')->inRandomOrder()->first()->id,
//            'parent_category_id' => fake()->numberBetween(3,8),
        ];
    }
}
