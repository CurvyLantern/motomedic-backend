<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    use HasFactory;
    protected $fillable = [
        'attribute_value',
        'product_id',
        'attribute_id',
        'color_id',
        'image',
        'price',
    ];
}
