<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'brand_id',
        'sku',
        'model',
        'color_id',
        'material',
        'weight',
        'price',
        'description',
        'warranty',
        'status',
        'thumbnail_image'
    ];

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'sku', 'sku');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function images()
    {
        return $this->belongsToMany(Media::class, 'product_images');
    }

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'product_attributes')
            ->using(ProductAttribute::class)
            ->withPivot('attribute_value_id');
    }



    // public function product_attributes()
    // {
    //     return $this->hasMany(ProductAttribute::class, 'productId');
    // }
    public function attributeValues()
    {
        return $this->belongsToMany(AttributeValue::class, 'product_attributes')
            ->using(ProductAttribute::class)
            ->withPivot('attribute_id');
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }




    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = $this->generateSlug($value);
    }

    protected function generateSlug($name)
    {
        // Convert the name to a slug using Laravel's Str::slug
        $slug = Str::slug($name);

        // Check if a category with the same slug already exists
        $count = static::where('slug', $slug)->where('id', '!=', $this->id)->count();

        // If a category with the same slug exists, append a number to make it unique
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        return $slug;
    }
}
