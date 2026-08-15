<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    const ENTREGA_INMEDIATA = 5;

    protected $fillable = ['name', 'slug', 'is_active'];

    public function scopeParaEntregaPorPedido($query)
    {
        return $query->whereNotIn('id', [self::ENTREGA_INMEDIATA]);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function scopeHasProducts(Builder $query): Builder
    {
        return $query->whereHas('products', function (Builder $query) {
            $query->where('is_active', true);
        });
    }
}
