<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
  use HasFactory;
  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  // protected $guard = 'admin';
  protected $fillable = [
    'name',
    'email',
    'phone',
    'address',
    'bike_info',
    'status',
  ];
}
/**
 * The attributes that should be hidden for serialization.
 *
 * @var array<int, string>
 */
// protected $hidden = [
//     'password',
//     'remember_token',
// ];

/**
 * The attributes that should be cast.
 *
 * @var array<string, string>
 */
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    //     'password' => 'hashed',
    // ];
