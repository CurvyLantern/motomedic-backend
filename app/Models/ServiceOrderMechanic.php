<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderMechanic extends Model
{
  protected $fillable = ['service_order_items_id', 'mechanic_id', 'finished_at'];

  // Define the relationships
  public function serviceOrderItem()
  {
    return $this->belongsTo(ServiceOrderItem::class);
  }

  public function mechanic()
  {
    return $this->belongsTo(Mechanic::class);
  }
}
