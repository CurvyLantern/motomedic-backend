<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
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
            'name' => $productName,
            'slug' => Str::slug($productName, '-'),
            'category_id' => Category::select('id')->inRandomOrder()->first()->id,
            'brand_id' => Brand::select('id')->inRandomOrder()->first()->id,
            'sku' => 'SKU-' . fake()->unique()->randomNumber(5),
            'model' => fake()->word,
            'color_id' => Color::select('id')->inRandomOrder()->first()->id,
            'material' => fake()->word,
            'weight' => fake()->randomFloat(2, 0.1, 100),
            'price' => fake()->randomFloat(2, 10, 500),
            'description' => fake()->sentence(),
            'warranty' => fake()->randomNumber(),
            'status' => fake()->boolean(),
        ];
    }
}
