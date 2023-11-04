<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderItem extends Model
{
  protected $fillable = ['order_id', 'service_type_id', 'seller_id', 'problem_details', 'status', 'service_started_at', 'service_finished_at', 'total_price', 'unit_price', 'tax', 'discount'];

  // Define the relationships
  public function order()
  {
    return $this->belongsTo(Order::class);
  }

  public function serviceType()
  {
    return $this->belongsTo(ServiceType::class);
  }

  public function seller()
  {
    return $this->belongsTo(User::class, 'seller_id');
  }
}
