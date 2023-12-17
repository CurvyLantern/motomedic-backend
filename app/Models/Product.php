<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Product extends Model
{
  use HasFactory;
  protected $casts = [
    'variation_product' => 'boolean',
  ];
  protected $fillable = [
    'name',
    'slug',
    'category_id',
    'brand_id',
    'sku',
    'model_id',
    'color_id',
    'weight',
    'barcode',
    'description',
    'warranty',
    'status',
    'thumbnail_image',
    'variation_product'
  ];
  protected $appends = ['stock_count', 'parent_category_id'];


  public function getParentCategoryIdAttribute()
  {
    return $this->category->parent_category_id; // Use first() instead of get()
  }
  public function getStockCountAttribute()
  {
    return $this->inventory->stock_count ?? 0; // Use first() instead of get()
    // return $inventory ? $inventory->stock_count : 0;
  }

  public function inventory()
  {
    return $this->hasOne(Inventory::class, 'sku', 'sku');
  }

  public function price()
  {
    if ($this->variation_product) {
      return null;
    } else {
      return $this->hasOne(Price::class, 'sku', 'sku')->latest();
    }
  }

  public function color()
  {
    return $this->belongsTo(Color::class, 'color_id');
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

  public function productModel(): BelongsTo
  {
    return $this->belongsTo(ProductModel::class, 'model_id');
  }

  public function attributes()
  {
    return $this->belongsToMany(Attribute::class, 'product_attributes')
      ->using(ProductAttribute::class)
      ->withPivot('attribute_value_id');
  }


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

    $slug = Str::slug($name);


    $count = static::where('slug', $slug)->where('id', '!=', $this->id)->count();


    if ($count > 0) {
      $slug .= '-' . ($count + 1);
    }

    return $slug;
  }
}
