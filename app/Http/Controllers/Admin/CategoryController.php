<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'is_active' => 'boolean',
        ]);

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('message', 'Categoría creada con éxito');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $category = Category::findOrFail($category->id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,'.$category->id,
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('message', 'Categoría actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Validación de seguridad: No borrar categorías con productos
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'No puedes eliminar una categoría que tiene productos asociados.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'La categoría se eliminó correctamente.');
    }
}
