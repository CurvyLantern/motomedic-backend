<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaImage extends Model
{
    use HasFactory;
    protected $fillable = [
        'imageName',
        'imagePath',
        'hostId',
    ];

    public function productImage()
    {
        return $this->belongsTo(Product::class, 'id');
    }
}
