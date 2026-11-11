<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HeroSlide;

class HeroSlideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiamos registros previos si existieran
        HeroSlide::truncate();

        // Leemos la lista desde config/slider.php
        $defaultSlides = config('defaults.images.hero', []);

        foreach ($defaultSlides as $index => $slide) {
            HeroSlide::create([
                'title' => $slide['title'],
                'image_path' => $slide['image'],
                'order_position' => $index + 1,
            ]);
        }
    }
}
