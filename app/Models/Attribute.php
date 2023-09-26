<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'priority'
    ];

    public function attributeValues()
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_attributes')
            ->using(ProductAttribute::class)
            ->withPivot('attribute_value_id');
    }
}
