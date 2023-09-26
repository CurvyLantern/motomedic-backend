<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Attribute extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'priority',
    ];

    public function attributeValues(): HasMany
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_attributes')
            ->using(ProductAttribute::class)
            ->withPivot('attribute_value_id');
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = $this->generateSlug($value);
    }

    protected function generateSlug($name)
    {
        // Convert the name to a slug using Laravel's Str::slug
        $slug = Str::slug($name);

        // Check if a category with the same slug already exists
        $count = static::where('slug', $slug)->where('id', '!=', $this->id)->count();

        // If a category with the same slug exists, append a number to make it unique
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        return $slug;
    }
}
