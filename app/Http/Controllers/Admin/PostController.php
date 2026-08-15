<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    // 1. Listado de Novedades en el Panel
    public function index()
    {
        $posts = Post::latest()
            ->paginate(10)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'is_active' => $post->is_active,
                    'published_at' => $post->published_at->format('d/m/Y H:i'),
                    'image_url' => $post->image_path ? asset('storage/' . $post->image_path) : null,
                ];
            });

        return Inertia::render('admin/posts/index', [
            'posts' => $posts
        ]);
    }

    // 2. Vista de Creación
    public function create()
    {
        return Inertia::render('admin/posts/create');
    }

    // 3. Guardar la nueva publicación
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:6048', // Max 2MB
            'video' => 'nullable|mimes:mp4,webm,quicktime|max:20480', // 🌟 Valida videos de hasta 20MB
            'is_active' => 'required|boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        // 🌟 Procesamos el video si Eliana subió uno
        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('posts/videos', 'public');
        }

        Post::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . rand(1000, 9999), // Evita duplicados si repite títulos
            'content' => $request->content,
            'image_path' => $imagePath,
            'video_path' => $videoPath, // 🌟 Guardamos la ruta física
            'is_active' => $request->is_active,
            'published_at' => now(),
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Novedad publicada con éxito.');
    }

    // 4. Vista de Edición
    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/edit', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'is_active' => $post->is_active,
                'image_url' => $post->image_path ? asset('storage/' . $post->image_path) : null,
                'video_url' => $post->video_path ? asset('storage/' . $post->video_path) : null, // 🌟 NUEVO
            ]
        ]);
    }

    // 5. Actualizar la publicación
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:6048',
            'video' => 'nullable|mimes:mp4,webm,quicktime|max:20480',
            'is_active' => 'required|boolean',
        ]);

        $imagePath = $post->image_path;

        if ($request->hasFile('image')) {
            // Borramos la imagen anterior si existía
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $videoPath = $post->video_path;
        if ($request->hasFile('video')) {
            if ($post->video_path) {
                Storage::disk('public')->delete($post->video_path);
            }
            $videoPath = $request->file('video')->store('posts/videos', 'public');
        }

        $post->update([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . $post->id, // Mantiene el slug controlado
            'content' => $request->content,
            'image_path' => $imagePath,
            'video_path' => $videoPath,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Novedad actualizada con éxito.');
    }

    // 6. Eliminar publicación
    public function destroy(Post $post)
    {
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        // Borramos el video del pie si existe 🌟
        if ($post->video_path) {
            Storage::disk('public')->delete($post->video_path);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Publicación eliminada correctamente.');
    }
}
