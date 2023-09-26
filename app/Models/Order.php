<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_id',
        'total',
        'discount',
        'tax',
        'note',
        'status',
    ];

    public function customer(){
        return $this->belongsToMany(Customer::class,'customers','id','customer_id');
    }
//    public function products()
//    {
//        return $this->belongsToMany(Product::class);
//    }
//
//    public function service()
//    {
//        return $this->belongsToMany(Service::class);
//    }
//    public function customer()
//    {
//        return $this->belongsToMany(Customer::class);
//    }
//    public function queues()
//    {
//        return $this->belongsTo(Queue::class);
//    }
}
