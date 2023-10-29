<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Brand extends Model
{
  use HasFactory;
  protected $fillable = [
    'name',
    'slug',
    'image',
    'description',
    'status'
  ];

  public function productModels()
  {
    return $this->belongsToMany(ProductModel::class, 'brand_model', 'brand_id', 'product_model_id');
  }

  public function products()
  {
    return $this->hasMany(Product::class, 'brand_id');
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
