<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use App\Models\HeroSlide;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    /**
     * Muestra el panel de configuración general y secciones.
     */
    public function index(): Response
    {
        // Traemos las 4 secciones transformando el path de la foto a URL pública
        $sections = PageSection::all()->map(function ($section) {
            return [
                'id' => $section->id,
                'slug' => $section->slug,
                'title' => $section->title,
                'description' => $section->description,
                'content' => $section->content,
                'image_url' => $section->image_path, // $section->image_path ? asset('storage/' . $section->image_path) : null,
            ];
        });

        // Convertimos la tabla Key-Value en un objeto chato asociativo para el formulario de React
        $settings = SiteSetting::pluck('value', 'key')->all();

        $slides = HeroSlide::orderBy('order_position', 'asc')->get();
// dd($slides);
        return Inertia::render('admin/settings/site-index', [
            'sections' => $sections,
            'settings' => $settings,
            'slides' => $slides,
        ]);
    }

    /**
     * Actualiza una sección de página específica (Cabecera + Contenido).
     */
    public function updateSection(Request $request, PageSection $section): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:6048',
        ]);

        $section->title = $validated['title'];
        $section->description = $validated['description'];
        $section->content = $validated['content'] ?? null;

        // Manejo del banner de cabecera
        if ($request->hasFile('image')) {
            if ($section->image_path) {
                Storage::disk('public')->delete($section->image_path);
            }
            $section->image_path = $request->file('image')->store('sections', 'public');
        }

        $section->save();

        return back()->with('success', "Sección {$section->title} actualizada.");
    }

    /**
     * Actualiza las configuraciones generales del negocio (Key-Value).
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'whatsapp_number' => 'required|string|max:50',
            'business_address' => 'required|string|max:255',
            'latitude' => 'required|string|max:50',
            'longitude' => 'required|string|max:50',
            'instagram_profile' => 'nullable|url|max:255',
            'facebook_profile' => 'nullable|url|max:255',
            'texto_pie_de_pagina' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Configuraciones del negocio guardadas con éxito.');
    }

/**
 * Subir una nueva imagen al Slider
 */
    public function storeSlide(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => 'required|image|max:6048', // Máx 3MB
            'title' => 'nullable|string|max:100',
        ]);

        // Calculamos el número de orden siguiente
        $nextOrder = HeroSlide::max('order_position') + 1;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Guardamos con el nombre formateado por número de orden: 1_timestamp.ext
            $filename = $nextOrder . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('hero-slider', $filename, 'public');

            HeroSlide::create([
                'title' => $request->title,
                'image_path' => $path,
                'order_position' => $nextOrder,
            ]);
        }

        return back()->with('success', 'Imagen agregada al slider.');
    }
    /**
     * Eliminar una imagen del Slider
     */
    public function destroySlide(HeroSlide $slide): RedirectResponse
    {
        if (
            $slide->image_path
            && str_contains($slide->image_path, 'defults') === false
            && Storage::disk('public')->exists($slide->image_path)
        ) {
            Storage::disk('public')->delete($slide->image_path);
        }

        $slide->delete();

        return back()->with('success', 'Imagen eliminada del slider.');
    }

    /**
     * Resetear Slider a los valores por defecto
     */
    public function resetSlider(): RedirectResponse
    {
        // dd('gets here');
        // Borramos los registros y fotos actuales
        $currentSlides = HeroSlide::all();
        foreach ($currentSlides as $slide) {
            if (
                Storage::disk('public')->exists($slide->image_path)
                && str_contains($slide->image_path, 'defults') === false
            ) {
                Storage::disk('public')->delete($slide->image_path);
            }
            $slide->delete();
        }

        // Cargamos los valores desde config/slider.php
        $configKey = 'defaults.images.hero';
        $imagePath = str_replace('.', '/', $configKey);
        $defaults = config($configKey, []);
        // dd($defaults);
        foreach ($defaults as $index => $default) {
            HeroSlide::create([
                'title' => $default['title'],
                'image_path' => $default['image'],
                'order_position' => $index + 1,
            ]);
        }

        return back()->with('success', 'Slider restaurado a las imágenes por defecto.');
    }
}