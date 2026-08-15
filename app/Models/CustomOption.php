<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomOption extends Model
{
    protected $fillable = [
        'custom_attribute_id',
        'name',
        'description',
        'image',
        'additional_price',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public const STORAGE_PATH = 'images/options';

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(CustomAttribute::class, 'custom_attribute_id');
    }

    public function productsWithDefault()
    {
        return $this->belongsToMany(Product::class, 'product_default_options', 'custom_option_id', 'product_id');
    }
}
