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

    public function productOrVariation()
    {
        return Product::whereHas('inventory', function ($query) {
            $query->where('sku', $this->sku);
        })->first() ?? ProductVariation::whereHas('inventory', function ($query) {
            $query->where('sku', $this->sku);
        })->first();
    }
}
