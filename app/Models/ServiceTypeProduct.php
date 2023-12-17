<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceTypeProduct extends Model
{
  protected $fillable = ['service_type_id', 'product_sku', 'quantity', 'description'];
  protected $appends = ['product'];

  // Define the relationships
  public function serviceType()
  {
    return $this->belongsTo(ServiceType::class);
  }


  public function getProductAttribute()
  {

    $product = null;

    // Use first() to execute the query and retrieve the result
    $product = Product::with('price', 'inventory')
      ->where('sku', $this->product_sku)
      ->first();

    if (!$product) {
      $product = ProductVariation::with('price', 'inventory')
        ->where('sku', $this->product_sku)
        ->first();
    }
    return $product;
  }
}
