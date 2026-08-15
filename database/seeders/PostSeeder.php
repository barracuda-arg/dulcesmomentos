<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
// 1. Post de ejemplo: Sorteo
        Post::create([
            'title' => '¡Gran Sorteo por el Día del Padre! 🎁',
            'slug' => Str::slug('Gran Sorteo por el Día del Padre'),
            'content' => "En Dulces Momentos queremos mimar a papá en su día. Por eso, lanzamos un sorteo espectacular de un Box Dulce Premium que incluye: 1 Mini Torta Rogel, 6 alfajores de chocolate y 4 tarta de frutillas.\n\n¿Cómo participar?\n1. Seguinos en nuestra cuenta de Instagram.\n2. Dale amor a la última publicación.\n3. Etiquetá a dos amigos en los comentarios.\n\nTienen tiempo de participar hasta el sábado a las 20:00 hs. ¡Muchos éxitos a todos!",
            'image_path' => null, // Dejamos null para subir la foto real desde el panel más adelante
            'is_active' => true,
            'published_at' => now(),
        ]);

        // 2. Post de ejemplo: Receta / Tip
        Post::create([
            'title' => 'El secreto para un Merengue Italiano perfecto 🎂',
            'slug' => Str::slug('El secreto para un Merengue Italiano perfecto'),
            'content' => "Hacer merengue italiano puede parecer un desafío, pero con este tip de Eliana no te va a fallar nunca más. La clave absoluta está en el almíbar.\n\nCuando pongas a hervir el azúcar con el agua, necesitás que llegue exactamente a los 118°C (punto bola blanda). Si no tenés termómetro, te das cuenta porque las burbujas empiezan a encadenarse pesadamente.\n\nVertelo en forma de hilo sobre las claras batidas a nieve mientras la batidora sigue andando a máxima velocidad y no pares de batir hasta que el bowl esté completamente frío. ¡Te garantizamos un brillo y una firmeza espectaculares para tus decoraciones!",
            'image_path' => null,
            'is_active' => true,
            'published_at' => now()->subDays(2), // Simula que se subió hace dos días
        ]);
    }
}
