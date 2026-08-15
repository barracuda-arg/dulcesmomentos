<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public const STORAGE_PATH = 'images/products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'is_featured',
        'is_active',
        'category_id',
        'slug',
        'is_customizable',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeParaEntregaInmediata($query)
    {
        return $query->with('category')
            ->whereHas(
                'category',
                function ($query) {
                    $query->where('category_id', Category::ENTREGA_INMEDIATA);
                }
            )
            ->where('is_active', true);
    }

    public function scopeParaEntregaPorPedido($query)
    {
        return $query->with('category')
            ->whereHas(
                'category',
                function ($query) {
                    $query->whereNotIn('category_id', [Category::ENTREGA_INMEDIATA]);
                }
            )
            ->where('is_active', true);
    }

    // public function customAttributes()
    // {
    //     return $this->belongsToMany(CustomAttribute::class);
    // }
    public function defaultOptions()
    {
        // Usamos belongsToMany para obtener la colección de opciones directamente
        return $this->belongsToMany(
            // CustomAttributeOption::class,
            CustomOption::class,
            'product_default_options',
            'product_id',
            'custom_option_id'
        )->with('attribute'); // Cargamos el atributo para saber a qué grupo pertenece cada opción
    }
}
