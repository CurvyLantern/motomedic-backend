<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryRecord extends Model
{
  use HasFactory;

  protected $fillable = ['inventory_date', 'inventory_updater_id', 'inventory_vendor_id', 'product_sku', 'quantity', 'per_unit_cost', 'type'];

  protected $casts = [
    'inventory_date' => 'datetime'
  ];

  public function vendor()
  {
    return $this->belongsTo(Vendor::class, 'inventory_vendor_id');
  }

  public function updater()
  {
    return $this->belongsTo(User::class, 'inventory_updater_id');
  }
}
