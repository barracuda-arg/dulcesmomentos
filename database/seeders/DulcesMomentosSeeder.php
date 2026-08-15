<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DulcesMomentosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Para Ellas', 'slug' => 'tortas-mujeres'],
            ['name' => 'Para Ellos', 'slug' => 'tortas-hombres'],
            ['name' => 'Chocotortas', 'slug' => 'chocotortas'],
            ['name' => 'Nuestras Especialidades', 'slug' => 'nuestras-especialidades'],
            ['name' => 'Tentaciones Diarias', 'slug' => 'tentaciones-diarias'],
        ];
        $img = 'demo-';
        $counter = 1;
        foreach ($categories as $cat) {
            $category = Category::create($cat);
            // Creamos 1 producto de ejemplo por categoría
            $numProducts = ($cat['name'] === 'Tentaciones Diarias') ? 5 : 1; // Puedes ajustar este número según tus necesidades
            for ($i = 1; $i <= $numProducts; $i++) {
                $productImage = $img.$counter++.'.jpg';
                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => 'Torta Especial '.$cat['name'], //  . " " . $i,
                    'slug' => Str::slug('Torta Especial '.$cat['name'].' '.$i),
                    'description' => 'Una delicia artesanal pensada especialmente para compartir en momentos únicos.',
                    'price' => 15000.00,
                    'is_customizable' => true, // Marcamos todas como personalizables para mostrar la funcionalidad
                    'image' => '/images/products/'.$productImage, // Asegúrate de tener una imagen aquí
                    'is_featured' => true,
                ]);

                $path = resource_path('json/product_defaults.json');

                if (File::exists($path)) {
                    $json = file_get_contents($path);
                    $defaults = json_decode($json, true);
                }
                // Insertamos en la tabla pivot
                $product->defaultOptions()->attach($defaults['default_option_ids']);
            }
        }
    }
}
