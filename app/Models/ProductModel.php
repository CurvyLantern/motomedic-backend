<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductModel extends Model
{
  use HasFactory;

  protected $fillable = ['name', 'slug'];

  public function brands()
  {
    return $this->belongsToMany(Brand::class, 'brand_model', 'product_model_id', 'brand_id');
  }

  public function setNameAttribute($value)
  {
    $this->attributes['name'] = $value;
    $this->attributes['slug'] = $this->generateSlug($value);
  }

  protected function generateSlug($name)
  {
    $slug = Str::slug($name);

    $count = static::where('slug', $slug)->where('id', '!=', $this->id)->count();

    if ($count > 0) {
      $slug .= '-' . ($count + 1);
    }

    return $slug;
  }
}
