<?php

namespace App\Http\Controllers;

use App\Models\PageSection;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\SiteSetting;
use App\Mail\ContactMessageMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class ContactoController extends Controller
{
    public function show(): Response
    {
        $section = PageSection::where('slug', 'contacto')->firstOrFail();

        return Inertia::render('contacto', [
            'section' => [
                'title' => $section->title,
                'description' => $section->description,
                'content' => $section->content,
                'image_url' => $section->image_path // ? asset('storage/' . $section->image_path) : null,
            ]
        ]);
    }

    public function sendContactEmail(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'message' => 'required|string|min:10|max:2000',
        ]);

        // Busca la dirección configurada en la tabla site_settings
        $adminEmail = SiteSetting::getValue('contact_email', 'admin@ejemplo.com');

        Mail::to($adminEmail)->send(new ContactMessageMail($validated));

        return back();
    }

}
