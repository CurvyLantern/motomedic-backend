<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\AttributeValue;
use App\Models\Color;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariation>
 */
class ProductVariationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::select('id')->inRandomOrder()->first()->id,
            'attribute_id' => ProductAttribute::select('id')->inRandomOrder()->first()->id,
            'attribute_value_id' => AttributeValue::select('id')->inRandomOrder()->first()->id,
            'color_id' => Color::select('id')->inRandomOrder()->first()->id,
            'image' => fake()->imageUrl(),
            'price' => rand(2000, 9000),
        ];
    }
}
