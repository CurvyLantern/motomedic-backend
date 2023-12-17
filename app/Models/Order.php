<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
  use HasFactory;
  protected $fillable = [
    'customer_id',
    'seller_id',
    'note',
    'status',
    'total_price',
    'paid_amount',
    'overall_discount',
    'overall_discount_type',
    'overall_tax',
    'overall_tax_type',
  ];
  protected $casts = [
    'paid_amount' => 'decimal:2',
  ];

  protected static function boot()
  {
    parent::boot();

    // Listen for the 'saving' event
    static::saving(function ($order) {
      // Calculate total_price before saving
      $order->calculateTotalPrice();
    });
  }

  public function customer()
  {
    return $this->belongsTo(Customer::class, 'customer_id');
  }

  public function seller()
  {
    return $this->belongsTo(User::class, 'seller_id');
  }

  public function serviceOrderItems()
  {
    return $this->hasMany(ServiceOrderItem::class);
  }

  public function productOrderItems()
  {
    return $this->hasMany(ProductOrderItem::class);
  }


  public function orderItems()
  {
    return $this->hasMany(OrderItem::class);
  }
  //    public function products()
  //    {
  //        return $this->belongsToMany(Product::class);
  //    }
  //
  //    public function service()
  //    {
  //        return $this->belongsToMany(Service::class);
  //    }
  //    public function customer()
  //    {
  //        return $this->belongsToMany(Customer::class);
  //    }
  //    public function queues()
  //    {
  //        return $this->belongsTo(Queue::class);
  //    }



  public function calculateTotalPrice()
  {
    $productItems = $this->productOrderItems()->get();
    $serviceItems = $this->serviceOrderItems()->get();
    $totalPrice = 0;
    foreach ($productItems as $productItem) {
      $totalPrice = $totalPrice + $productItem->total_price;
    }
    foreach ($serviceItems as $serviceItem) {
      $totalPrice = $totalPrice + $serviceItem->total_price;
    }

    $discount = $this->overall_discount ?? 0;
    $discountType = $this->overall_discount_type ?? 'flat';
    $tax = $this->overall_tax ?? 0;
    $taxType = $this->overall_tax_type ?? 'flat';

    // Calculate discount based on discount_type
    if ($discountType === 'percent') {
      $totalPrice = $totalPrice -  $totalPrice * ($discount / 100);
    } else {
      $totalPrice = $totalPrice - $discount;
    }


    // Calculate tax based on tax_type
    if ($taxType === 'percent') {
      $totalPrice = $totalPrice - $totalPrice * ($tax / 100);
    } else {
      $totalPrice = $totalPrice - $tax;
    }



    // Set the calculated total_price value
    // $this->attributes['total_price'] = $totalPrice;
    $this->attributes['total_price'] = $totalPrice;
  }
}
