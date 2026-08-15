<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
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

        return Inertia::render('admin/settings/site-index', [
            'sections' => $sections,
            'settings' => $settings,
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
            'image' => 'nullable|image|max:6048', // Max 2MB para banners
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
}