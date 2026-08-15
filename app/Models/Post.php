<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

        protected $fillable = [
            'title',
            'slug',
            'content',
            'image_path',
            'video_path', // 🌟 NUEVO
            'is_active',
            'published_at',
        ];

        protected $casts = [
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
}
