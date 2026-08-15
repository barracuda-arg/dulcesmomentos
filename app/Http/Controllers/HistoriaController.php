<?php

namespace App\Http\Controllers;

use App\Models\PageSection;
use Inertia\Inertia;
use Inertia\Response;

class HistoriaController extends Controller
{
    public function __invoke(): Response
    {
        $section = PageSection::where('slug', 'nuestra-historia')->firstOrFail();

        return Inertia::render('historia', [
            'section' => [
                'title' => $section->title,
                'description' => $section->description,
                'content' => $section->content,
                'image_url' => $section->image_path // ? asset('storage/' . $section->image_path) : null,
            ]
        ]);
    }
}
