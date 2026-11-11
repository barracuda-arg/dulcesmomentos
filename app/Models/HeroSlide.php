<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = ['title', 'image_path', 'order_position'];
    // Incluimos automáticamente 'image_url' al convertir el modelo a JSON/Array para Inertia
    protected $appends = ['image_url'];
    // /**
    //  * Devuelve la URL pública correcta de la imagen
    //  * dependiendo de si vive en public/images o en storage/
    //  */
    // protected function imageUrl(): Attribute
    // {
    //     return Attribute::make(
    //         get: function () {
    //             if (str_starts_with($this->image_path, 'images/')) {
    //                 return asset($this->image_path);
    //             }

    //             return asset('storage/' . $this->image_path);
    //         }
    //     );
    // }

/**
     * Accesor tradicional: get[NombreEnCamelCase]Attribute
     */
    public function getImageUrlAttribute(): string
    {
        if (str_starts_with($this->image_path, 'images/')) {
            return asset($this->image_path);
        }

        return asset('storage/' . $this->image_path);
    }
}
