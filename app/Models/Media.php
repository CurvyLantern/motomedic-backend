<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Media extends Model
{
    use HasFactory;
    protected $fillable = [
        'image_path',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_images');
    }
}
