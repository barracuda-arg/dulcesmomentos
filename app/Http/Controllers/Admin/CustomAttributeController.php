<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomAttribute;
use App\Models\CustomOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomAttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/customizations/index', [
            'attributes' => CustomAttribute::with('options')->orderBy('step_number')->get(),
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
            'is_multiple' => 'boolean',
            'is_active' => 'boolean',
            'is_required' => 'boolean',
            'step_number' => 'required|integer|min:0',
        ]);

        CustomAttribute::create($validated);

        return redirect()->back()->with('message', 'Grupo de personalización creado');
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
    public function update(Request $request, string $id)
    {
        $attribute = CustomAttribute::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'step_number' => 'required|integer|min:0',
            'is_multiple' => 'required|boolean',
            'is_active' => 'boolean',
            'is_required' => 'boolean',
        ]);
        // dd($validated);
        $attribute->update($validated);

        return redirect()->back()->with('success', 'Grupo actualizado correctamente');
    }

    public function updateOption(Request $request, CustomOption $option)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'additional_price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        // 1. Quitamos 'image' del array inicial para que no lo pise con null
        $dataToUpdate = collect($validated)->except('image')->toArray();

        // Si subió una imagen nueva, borramos la anterior y guardamos la nueva
        if ($request->hasFile('image')) {
            if ($option->image) {
                \Storage::disk('public')->delete($option->image);
            }
            // $dataToUpdate['image'] = $request->file('image')->store('options', 'public');
            $path = $request->file('image')->store(CustomOption::STORAGE_PATH, 'public');
            $dataToUpdate['image'] = $path;
        }

        $option->update($dataToUpdate);

        return redirect()->back()->with('message', 'Opción actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function storeAttribute(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_multiple' => 'boolean',
            'is_required' => 'boolean',
        ]);

        CustomAttribute::create($validated);

        return redirect()->back()->with('message', 'Grupo de personalización creado');
    }

    public function storeOption(Request $request, CustomAttribute $attribute)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'additional_price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048', // Para las fotos de los rellenos
        ]);

        // if ($request->hasFile('image')) {
        //     $validated['image'] = $request->file('image')->store('options', 'public');
        // }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store(CustomOption::STORAGE_PATH, 'public');
            $validated['image'] = $path;
        }

        $attribute->options()->create($validated);

        return redirect()->back()->with('message', 'Opción agregada con éxito');
    }

    // public function destroyOption(CustomOption $option)
    // {
    //     $option->delete();
    //     return redirect()->back();
    // }
    public function destroyOption(CustomOption $option)
    {
        // 1. Si tiene imagen, la borramos del storage
        if ($option->image) {
            \Storage::disk('public')->delete($option->image);
        }

        // 2. Borramos el registro
        $option->delete();

        // 3. Volvemos con un mensaje de éxito
        return redirect()->back()->with('message', 'Opción eliminada con éxito');
    }
}
