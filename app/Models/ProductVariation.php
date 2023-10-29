<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariation extends Model
{
  use HasFactory;
  protected $fillable = [
    'product_id',
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
  public function color(): BelongsTo
  {
    return $this->belongsTo(Color::class, 'color_id');
  }

  public function attributeValues(): BelongsToMany
  {
    return $this->belongsToMany(AttributeValue::class, 'product_attribute_values');
  }
}
