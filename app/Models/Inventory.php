<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;
    protected $fillable = [
        'sku',
        'stock_count'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'sku', 'sku');
    }
}
