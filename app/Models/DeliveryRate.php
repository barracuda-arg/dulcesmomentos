<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryRate extends Model
{
    //
    protected $fillable = ['max_distance_km', 'price'];

    // Nos aseguramos de que siempre vengan ordenados de menor a mayor km
    protected $casts = [
        'max_distance_km' => 'float',
        'price' => 'float',
    ];
}
