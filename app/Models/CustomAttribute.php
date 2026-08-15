<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomAttribute extends Model
{
    // 👈 Esto es lo que te falta
    protected $fillable = [
        'name',
        'description',
        'step_number',
        'is_multiple',
        'is_active',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_multiple' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function options()
    {
        return $this->hasMany(CustomOption::class);
    }
}
