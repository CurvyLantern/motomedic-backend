<?php

namespace Database\Factories;

use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productName = fake()->words(3, true);
        return [
            'productName' => $productName,
            'slug' => Str::slug($productName, '-'),
            'categoryId' => rand(1, 10),
            'brandId' => rand(1, 5),
            'model' => fake()->word,
            'color' => fake()->colorName,
            'productType' => fake()->randomElement(['simpleProduct', 'variationProduct']),
            'material' => fake()->word,
            'size' => fake()->word,
            'year' => fake()->year,
            'compitibility' => fake()->word,
            'condition' => fake()->word,
            'manufacturer' => fake()->company,
            'weight' => fake()->randomFloat(2, 0.1, 100),
            'quantity' => fake()->numberBetween(1, 100),
            'price' => fake()->randomFloat(2, 10, 500),
            'discount' => fake()->numberBetween(0, 50),
            'discountType' => fake()->randomElement(['percentage', 'fixed']),
            'primaryImg' => fake()->imageUrl(),
            // 'thumbImgId' => fake()->numberBetween(1,20),
            'shortDescriptions' => fake()->sentence,
            'longDescriptions' => fake()->paragraph,
            'installationMethod' => fake()->sentence,
            'note' => fake()->sentence,
            'warranty' => fake()->sentence,
            'rating' => fake()->randomFloat(1, 0, 5),
            'availability' => fake()->randomElement([true, false]),
            'status' => fake()->boolean(),
        ];
    }
}
