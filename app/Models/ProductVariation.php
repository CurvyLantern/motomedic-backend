<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductVariation extends Model
{
  use HasFactory;
  protected $fillable = [
    'product_id',
    'color_id',
    'model_id',
    'image',
    'sku',
    'barcode'
  ];
  protected $appends = ['name', 'stock_count', 'parent_category_id', 'category_id', 'category', 'brand_id', 'brand'];

  public function toArray()
  {
    $array = parent::toArray();
    $array['type'] = 'variation';
    return $array;
  }

  // public function getTypeAttribute()
  // {
  //   return 'variation';
  // }

  public function getParentCategoryIdAttribute()
  {
    return $this->product->category->parent_category_id; // Use first() instead of get()
  }
  public function getCategoryIdAttribute()
  {
    return $this->product->category_id; // Use first() instead of get()
  }
  public function getCategoryAttribute()
  {
    return $this->product->category; // Use first() instead of get()
  }
  public function getBrandIdAttribute()
  {
    return $this->product->brand_id; // Use first() instead of get()
  }
  public function getBrandAttribute()
  {
    return $this->product->brand; // Use first() instead of get()
  }



  public function getStockCountAttribute()
  {
    return $this->inventory->stock_count ?? 0; // Use first() instead of get()

  }

  public function productModel(): BelongsTo
  {
    return $this->belongsTo(ProductModel::class, 'model_id');
  }

  public function price()
  {
    return $this->hasOne(Price::class, 'sku', 'sku')->latest();
  }

  public function inventory()
  {
    return $this->hasOne(Inventory::class, 'sku', 'sku');
  }
  public function product()
  {
    return $this->belongsTo(Product::class);
  }
  public function color(): BelongsTo
  {
    return $this->belongsTo(Color::class, 'color_id');
  }

  public function attributeValues(): BelongsToMany
  {
    return $this->belongsToMany(AttributeValue::class, 'product_attribute_values');
  }


  /**
   * Get the name of the product variation.
   *
   * @return string
   */
  protected function getNameAttribute()
  {
    $productName = $this->product->name;
    $brandName = $this->product->brand->name ?? null;
    $modelName = $this->productModel->name;
    $colorName = $this->color->name;
    $attributeValuesNames = $this->getAttributeValuesNames();

    return "{$productName}-{$brandName}-{$modelName}-{$colorName}-{$attributeValuesNames}";
  }

  /**
   * Get the names of attribute values.
   *
   * @return string
   */
  protected function getAttributeValuesNames(): string
  {
    $attributeValues = $this->attributeValues;

    if ($attributeValues) {
      return $attributeValues->implode('name', ',');
    }

    return '';
  }
}
