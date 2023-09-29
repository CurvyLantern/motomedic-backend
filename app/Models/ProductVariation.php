<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
  use HasFactory;
  protected $fillable = [
    'attribute_value_id',
    'product_id',
    'attribute_id',
    'color_id',
    'image',
    'price',
    'sku',
    'name'
  ];

  public function inventory()
  {
    return $this->hasOne(Inventory::class, 'sku', 'sku');
  }
  public function product()
  {
    return $this->belongsTo(Product::class);
  }

  public function attribute()
  {
    return $this->belongsTo(Attribute::class, 'attribute_id');
  }

  public function attributeValue()
  {
    return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
  }
}
