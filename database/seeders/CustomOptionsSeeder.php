<?php

namespace Database\Seeders;

use App\Models\CustomAttribute;
use App\Models\CustomOption;
use Illuminate\Database\Seeder;

class CustomOptionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. RELLENOS (Múltiple elección)
        $counter = 0; // Para seguir con la numeración de las imágenes demo-07.jpg, demo-08.jpg, etc.

        $rellenos = CustomAttribute::create([
            'name' => 'Rellenos',
            'is_multiple' => true,
            'is_required' => true,
            'step_number' => 2, // Asignamos un número de paso para la lógica de personalización
        ]);

        $opcionesRellenos = [
            'Dulce de Leche', 'Crema Chantilly', 'Crema Chantilly con durazno',
            'Crema Chantilly de Frutilla', 'Crema Chantilly de Frutos rojos',
            'Crema Pastelera', 'Crema de Limón', 'Crema de Chocolate', 'Crema Moka',
        ];

        foreach ($opcionesRellenos as $opcion) {
            $counter++;
            CustomOption::create([
                'custom_attribute_id' => $rellenos->id,
                'name' => $opcion,
                'additional_price' => 0,
                'description' => 'El relleno de '.$opcion.' posee una textura suave y cremosa y se prepara con productos de mejor calidad.',
                'image' => 'images/options/demo-'.$counter.'.jpg',
            ]);
        }

        // . BIZCOCHUELOS (Precio adicional)
        $bizcochuelos = CustomAttribute::create([
            'name' => 'Bizcochuelos',
            'is_multiple' => true,
            'is_required' => true,
            'step_number' => 1, // Asignamos un número de paso para la lógica de personalización
        ]);

        $counter++;
        CustomOption::create(['custom_attribute_id' => $bizcochuelos->id, 'name' => 'Vainilla', 'additional_price' => 0, 'description' => 'Bizcochuelo sabor vainilla.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        $counter++;
        CustomOption::create(['custom_attribute_id' => $bizcochuelos->id, 'name' => 'Chocolate', 'additional_price' => 3000, 'description' => 'Bizcochuelo sabor chocolate.', 'image' => 'images/options/demo-'.$counter.'.jpg']);

        // Cobertura (Precio adicional)
        $coberturas = CustomAttribute::create([
            'name' => 'Coberturas',
            'is_multiple' => false,
            'is_required' => true,
            'step_number' => 3, // Asignamos un número de paso para la lógica de personalización
        ]);
        // demo-11
        foreach (['Chantilly'] as $f) {
            $counter++;
            CustomOption::create(['custom_attribute_id' => $coberturas->id, 'name' => $f, 'additional_price' => 0, 'description' => 'Bizcochuelo con cubierta de '.$f.'.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        }

        // 4. DECORACIÓN / TOPPERS
        $decoracion = CustomAttribute::create([
            'name' => 'Extras/Toppers',
            'is_multiple' => true,
            'is_required' => false,
            'step_number' => 4, // Asignamos un número de paso para la lógica de personalización
        ]);
        $counter++;
        CustomOption::create(['custom_attribute_id' => $decoracion->id, 'name' => 'Topper Con Frase', 'additional_price' => 1000, 'description' => 'Topper con frase personalizada.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        $counter++;
        CustomOption::create(['custom_attribute_id' => $decoracion->id, 'name' => 'Topper Con Figuras', 'additional_price' => 5000, 'description' => 'Topper con figuras comestibles.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        $counter++;
        CustomOption::create(['custom_attribute_id' => $decoracion->id, 'name' => 'Laminas comestibles', 'additional_price' => 5000, 'description' => 'Láminas comestibles para decoración.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        // demo-15
        // 4. FORMATOS
        $formatos = CustomAttribute::create([
            'name' => 'Formatos',
            'is_multiple' => false,
            'is_required' => true,
            'step_number' => 0, // Asignamos un número de paso para la lógica de personalización
        ]);

        foreach (['Redonda', 'Cuadrada', 'de Corazón'] as $f) {
            $counter++;
            CustomOption::create(['custom_attribute_id' => $formatos->id, 'name' => $f, 'additional_price' => 0, 'description' => 'Bizcochuelo con forma '.$f.'.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        }

        // demo-19
        $pesos = CustomAttribute::create([
            'name' => 'Peso',
            'is_multiple' => false,
            'is_required' => true,
            'step_number' => 5, // Asignamos un número de paso para la lógica de personalización
        ]);

        $pesosItems = [
            ['name' => '1 kg', 'additional_price' => 20000],
            ['name' => '1.2 kg', 'additional_price' => 24000],
            ['name' => '1.5 kg', 'additional_price' => 30000],
            ['name' => '2 kg', 'additional_price' => 40000],
            ['name' => '2.5 kg', 'additional_price' => 50000],
            ['name' => '3 kg', 'additional_price' => 60000],
        ];
        foreach ($pesosItems as $peso) {
            $counter++;
            CustomOption::create(['custom_attribute_id' => $pesos->id, 'name' => $peso['name'], 'additional_price' => $peso['additional_price'], 'description' => 'Torta de '.$peso['name'].' kilogramos.', 'image' => 'images/options/demo-'.$counter.'.jpg']);
        }

        // demo-25
        // $deliveryParent = CustomAttribute::create([
        //     'name' => 'Entrega',
        //     'is_multiple' => false,
        //     'is_required' => true,
        //     'step_number' => 6, // Asignamos un número de paso para la lógica de personalización
        // ]);
        // $deliveryItems = [
        //     ['name' => 'Retiro en Sucursal', 'additional_price' => 0],
        //     ['name' => 'Entrega en Domicilio', 'additional_price' => 0],
        // ];
        // foreach ($deliveryItems as $delivery) {
        //     $counter++;
        //     CustomOption::create(['custom_attribute_id' => $deliveryParent->id, 'name' => $delivery['name'], 'additional_price' => $delivery['additional_price'], 'description' => 'La entrega esta pactada para ' . $delivery['name'] . '.', 'image' => 'images/options/demo-' . $counter . '.jpg']);
        // }
    }
}
