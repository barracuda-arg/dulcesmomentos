<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class OrderFeedback extends Model
{
    //
    protected $table = 'order_feedback';
    protected $fillable = ['order_id', 'manual_customer_name', 'rating', 'comment', 'photo_path', 'is_approved'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
