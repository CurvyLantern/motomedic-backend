<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\ProductVariation;

class ProductOrderItem extends Model
{
  protected $fillable = ['order_id', 'product_sku', 'type', 'seller_id', 'status', 'quantity', 'total_price', 'unit_price', 'tax', 'discount', 'discount_type', 'tax_type'];
  protected $appends = ['product'];

  // Boot method to register the event listener
  protected static function boot()
  {
    parent::boot();

    // Listen for the 'saving' event
    static::saving(function ($productOrderItem) {
      // Calculate total_price before saving
      $productOrderItem->calculateTotalPrice();
    });

    static::saved(function ($productOrderItem) {
      $productOrderItem->order->calculateTotalPrice();
    });
  }



  // Define the relationships
  public function order()
  {
    return $this->belongsTo(Order::class);
  }

  public function seller()
  {
    return $this->belongsTo(User::class, 'seller_id');
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


  /**
   * Calculate total_price based on unit_count and price.
   */
  public function calculateTotalPrice()
  {
    $unitCount = $this->quantity ?? 0;
    $unitPrice = $this->unit_price ?? 0;
    $discount = $this->discount ?? 0;
    $discountType = $this->discount_type ?? 'flat'; // Default to 'flat' if not set
    $tax = $this->tax ?? 0;
    $taxType = $this->tax_type ?? 'flat'; // Default to 'flat' if not set


    $totalPrice = $unitPrice * $unitCount;
    // Calculate discount based on discount_type
    if ($discountType === 'percent') {
      $totalPrice -=  $totalPrice * ($discount / 100);
    } else {
      $totalPrice -= $discount;
    }


    // Calculate tax based on tax_type
    if ($taxType === 'percent') {
      $totalPrice -= $totalPrice * ($tax / 100);
    } else {
      $totalPrice -= $tax;
    }



    // Set the calculated total_price value
    $this->attributes['total_price'] = $totalPrice;
  }
}
