<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
  use HasFactory;

  protected $fillable = [
    'order_id',
    'type',
    'product_id',
    'service_id',
    'quantity',
    'total_price',
    'unit_price',
    'status'
  ];


  public function order()
  {
    return $this->belongsTo(Order::class);
  }

  public function product()
  {
    return $this->belongsTo(Product::class, 'product_id', 'id');
  }

  public function service()
  {
    return $this->belongsTo(Service::class, 'service_id', 'id');
  }
  // public function product()
  // {
  //   return $this->belongsTo(Product::class, 'product_id')->where('type', 'product');
  // }

  // public function service()
  // {
  //   return $this->belongsTo(Service::class, 'service_id')->where('type', 'service');
  // }

}
