<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_token',
        'user_id',
        'order_status_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'is_delivery',
        'delivery_address',
        'delivery_lat',
        'delivery_lng',
        'delivery_distance',
        'delivery_cost',
        'delivery_date',
        'notes',
        'items_amount',
        'total_amount',
    ];

    const STATUS_ENTREGADO = 6; // ID del estado "Entregado (Finalizado)" según Seeder
    const STATUS_CANCELADO = 7; // ID del estado "Cancelado" según Seeder

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'delivery_date' => 'datetime:d/m/Y H:i',
    ];

    /**
     * El "booted" method se ejecuta automáticamente al instanciar el modelo.
     * Es ideal para lógica que no querés repetir en los controladores.
     */
    protected static function booted()
    {
        static::creating(function ($order) {
            // Generamos un token único de 12 caracteres (ej: DM-A1B2-C3D4)
            // Le ponemos un prefijo de "Dulces Momentos" para que quede más pro
            $order->tracking_token = 'DM-'.strtoupper(Str::random(4).'-'.Str::random(4));

            // Seteamos el estado inicial por defecto (ID 1: Solicitado)
            if (! $order->order_status_id) {
                $order->order_status_id = 1;
            }
        });
    }

    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function feedback()
    {
        return $this->hasOne(OrderFeedback::class);
    }
}
