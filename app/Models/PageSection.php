<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = ['slug', 'title', 'description', 'image_path', 'content'];
}