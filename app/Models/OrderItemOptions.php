<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItemOptions extends Model
{
    //
    protected $fillable = [
        'order_item_id',
        'custom_option_id',
        'name_at_purchase',
        'price_at_purchase',
        'description_at_purchase',
        'image_at_purchase',
        'attribute_id_at_purchase',
        'attribute_name_at_purchase',
        'attribute_step_number_at_purchase',
    ];

    public function orderitem()
    {
        return $this->belongsTo(OrderItem::class);
    }
}
