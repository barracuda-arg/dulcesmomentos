<?php

namespace Database\Seeders;

use App\Models\PageSection;
use App\Models\SiteSetting;
use App\Models\DeliveryRate;
use Illuminate\Database\Seeder;

class InitialContentSeeder extends Seeder
{
    public function run(): void
    {
        // 🌟 Insertar las 4 secciones base del sitio
        $sections = [
            [
                'slug' => 'catalogo',
                'title' => 'Nuestro Catálogo',
                'description' => 'Explorá nuestras tortas artesanales, tartas y dulces preparados con amor.',
                'content' => null,
                'image_path' => '/images/sections/demo-catalogo.png'
            ],
            [
                'slug' => 'novedades',
                'title' => 'Novedades y Recetas',
                'description' => 'Enterate de los nuevos lanzamientos, eventos y secretos del mundo pastelero.',
                'content' => null,
                'image_path' => '/images/sections/demo-novedades.png'
            ],
            [
                'slug' => 'nuestra-historia',
                'title' => 'Nuestra Historia',
                'description' => 'Conocé cómo nació la pasión de Dulces Momentos y quiénes estamos detrás.',
                'content' => '<h3>Bienvenidos a nuestra cocina</h3><p>Acá podés escribir tu historia...</p>', // Texto enriquecido inicial
                'image_path' => '/images/sections/demo-historia.png'
            ],
            [
                'slug' => 'contacto',
                'title' => 'Contacto',
                'description' => '¿Tenés dudas o querés un pedido personalizado? Escribinos y te responderemos al toque.',
                'content' => null,
                'image_path' => '/images/sections/demo-contacto.png'
            ]
        ];

        foreach ($sections as $section) {
            PageSection::updateOrCreate(['slug' => $section['slug']], $section);
        }

        // 🌟 Insertar configuraciones base por defecto
        $settings = [
            'site_name' => 'Dulces Momentos',
            'contact_email' => 'eliana.pasteleria@gmail.com',
            'whatsapp_number' => '3875123456', // Formato de Salta para pruebas
            'business_address' => 'Salta Capital, Argentina',
            'latitude' => '-24.782127', // Coordenadas aproximadas de Salta
            'longitude' => '-65.423198',
            'instagram_profile' => 'https://www.instagram.com/dulcesmomentos',
            'facebook_profile' => 'https://www.facebook.com/dulcesmomentos',
            'texto_pie_de_pagina' => 'Repostería artesanal con el sabor de casa. Llevamos la dulzura de la familia Díaz a cada rincón de Salta.',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $deliveryRates = [
            ['max_distance_km' => '3.00', 'price' => 1500.00],
            ['max_distance_km' => '5.00', 'price' => 2000.00],
            ['max_distance_km' => '7.00', 'price' => 3000.00],
            ['max_distance_km' => '8.00', 'price' => 4000.00],
            ['max_distance_km' => '10.00', 'price' => 5000.00],
            ['max_distance_km' => '12.00', 'price' => 6000.00],
            ['max_distance_km' => '15.00', 'price' => 7000.00],
        ];

        foreach ($deliveryRates as $rate) {
            DeliveryRate::updateOrCreate(['max_distance_km' => $rate['max_distance_km']], ['price' => $rate['price']]);
        }
    }
}