<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {

        $section = PageSection::where('slug', 'novedades')->firstOrFail();

        $posts = Post::where('is_active', true)
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    // Extraemos un pequeño extracto limpio de HTML para la tarjeta
                    'excerpt' => strip_tags(substr($post->content, 0, 150)) . '...',
                    'image_url' => $post->image_path ? asset('storage/' . $post->image_path) : null,
                    'published_at' => $post->published_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'section' => [
                'title' => $section->title,
                'description' => $section->description,
                'content' => $section->content,
                'image_url' => $section->image_path, //  ? asset('storage/' . $section->image_path) : null,
                'highlighted_text' => "El rincón de la Dulzura", // Nueva propiedad opcional para resaltar texto
            ]
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('posts/show', [
            'post' => [
                'title' => $post->title,
                'content' => $post->content,
                'image_url' => $post->image_path ? asset('storage/' . $post->image_path) : null,
                'video_url' => $post->video_path ? asset('storage/' . $post->video_path) : null,
                'published_at' => $post->published_at->format('d \d\e F, Y'),
            ]
        ]);
    }
}