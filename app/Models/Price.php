<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
  use HasFactory;
  protected $fillable = [
    'sku',
    'buying_price',
    'selling_price',
  ];

  public function product()
  {
    $product = Product::where('sku', $this->sku)->first();

    if ($product) {
      return $product;
    } else {
      $variation = ProductVariation::with('product')->where('sku', $this->sku)->first();
      if ($variation) {
        return $variation;
      }
    }

    return null;
  }
}
