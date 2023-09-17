<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'customerId',
        'serviceId',
        'productId',
        'subtotal',
        'total',
        'tax',
        'discount',
        'note',
        'extra',
        'serviceStatus',
        'queue',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function service()
    {
        return $this->belongsToMany(Service::class);
    }
    public function customer()
    {
        return $this->belongsToMany(Customer::class);
    }
    public function queues()
    {
        return $this->belongsTo(Queue::class);
    }
}
