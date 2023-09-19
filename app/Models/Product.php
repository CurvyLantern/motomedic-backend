<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'productName',
        'slug',
        'categoryId',
        'brandId',
        'model',
        'color',
        'tags',
        'productType',
        'material',
        'size',
        'year',
        'compitibility',
        'condition',
        'manufacturer',
        'weight',
        'quantity',
        'price',
        'discount',
        'primaryImg',
        'thumbImg',
        'shortDescriptions',
        'longDescriptions',
        'installationMethod',
        'note',
        'warranty',
        'rating',
        'availability',
        'status',
    ];

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'sku', 'sku');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'id');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'id');
    }

    public function images()
    {
        return $this->belongsToMany(Media::class, 'product_images');
    }

    public function attributes()
    {
        return $this->belongsToMany(AttributeValue::class, 'product_attributes');
    }



    // public function product_attributes()
    // {
    //     return $this->hasMany(ProductAttribute::class, 'productId');
    // }
    public function attribute_values()
    {
        return $this->hasMany(AttributeValue::class, 'product_id', 'id');
    }
}
