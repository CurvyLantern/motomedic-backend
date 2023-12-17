<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderItem extends Model
{
  protected $fillable = ['order_id', 'service_type_id', 'seller_id', 'problem_details', 'status', 'service_started_at', 'service_finished_at', 'total_price', 'unit_price', 'tax', 'discount', 'discount_type', 'tax_type'];

  // Boot method to register the event listener
  protected static function boot()
  {
    parent::boot();

    // Listen for the 'saving' event
    static::saved(function ($serviceOrderItem) {
      $serviceOrderItem->calculateTotalPrice();
    });
    static::saved(function ($serviceOrderItem) {
      $serviceOrderItem->order->calculateTotalPrice();
    });
  }


  // Define the relationships
  public function order()
  {
    return $this->belongsTo(Order::class, 'order_id');
  }

  public function serviceType()
  {
    return $this->belongsTo(ServiceType::class, 'service_type_id');
  }

  public function seller()
  {
    return $this->belongsTo(User::class, 'seller_id');
  }

  public function serviceOrderMechanics()
  {
    return $this->hasMany(ServiceOrderMechanic::class);
  }



  /**
   * Calculate total_price based on unit_count and price.
   */
  public function calculateTotalPrice()
  {
    $unitCount = 1;
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
