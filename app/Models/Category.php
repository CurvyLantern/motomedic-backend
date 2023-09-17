<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'categoryName',
        'slug',
        'img',
        'description',
        'parentCategoryId',
    ];


    public function products()
    {
        return $this->hasMany(Product::class, 'categoryId');
    }

    public function parentCategoryId()
    {
        return $this->belongsTo(Category::class, 'id');
    }
}
