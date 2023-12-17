<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ServiceType extends Model
{
  protected $fillable = ['name', 'price', 'description'];

  // Define the relationships
  public function serviceTypeProducts()
  {
    return $this->hasMany(ServiceTypeProduct::class);
  }
}
