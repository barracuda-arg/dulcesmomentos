<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name', // Guardamos el nombre del producto al momento de la compra para tener un histórico, aunque el producto cambie después
        'product_image_at_purchase', // Guardamos la imagen del producto al momento de la compra para tener un histórico, aunque el producto cambie después
        'selections', // Aquí guardamos las opciones personalizadas seleccionadas (ej: "Con chocolate extra", "Sin nueces", etc)
        'quantity',
        'price_at_purchase', // Guardamos el precio al momento de la compra para tener un histórico, aunque el precio del producto cambie después
        'subtotal', // El subtotal de este item (price_at_purchase * quantity)
    ];

    protected $casts = [
        'selections' => 'array', // O 'json' en versiones más nuevas de Laravel
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function orderitemoptions()
    {
        return $this->hasMany(OrderItemOptions::class);
    }
}
