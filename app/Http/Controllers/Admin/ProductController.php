<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\CustomAttribute;
use App\Models\Product; // 👈 LA SOLUCIÓN AL ERROR
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')
            ->with('defaultOptions')
            ->latest()
            ->paginate(9); // Siempre paginado para que el panel no explote cuando tengas muchas tortas

        return Inertia::render('admin/products/index', [
            // 'products' => ProductResource::collection($products),
            'products' => ProductResource::collection($products)->response()->getData(true),
            'steps' => CustomAttribute::with('options')->get(),
        ]);
    }

    public function getDefaultOptions(Product $product)
    {
        return response()->json([
            'product' => $product,
            // IDs de las opciones que ya están marcadas como default
            'selected_ids' => $product->defaultOptions->pluck('id'),
            // Todos los atributos con sus opciones para el configurador
            'attributes' => CustomAttribute::with('options')->orderBy('step_number')->get(),
        ]);
    }

    // public function updateDefaultOptions(Request $request, Product $product)
    // {
    //     // Sincronizamos la pivot: lo que no esté en el array se borra, lo nuevo se agrega
    //     $product->defaultOptions()->sync($request->option_ids);

    //     return back()->with('success', 'Receta base actualizada');
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Traemos las categorías para el select del formulario
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product)
    {
        // dd([$request->all()]);
        // 1. Validación (Espejo de tu Zod en el frontend)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string', // Aquí llega el HTML de Tiptap
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5048',
            'slug' => 'required|string|max:255|unique:products',
            // 'slug' => [
            //     'required',
            //     'max:255',
            //     Rule::unique('products')->ignore($product->id),
            // ],
        ]);

        // 2. Manejo de la Imagen
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store(Product::STORAGE_PATH, 'public');
            $validated['image'] = $path;
        }

        // 3. Persistencia en DB
        $product = Product::create($validated);

        // Si el producto es customizable, le cargamos la base
        if ($product->is_customizable) {

            $path = resource_path('json/product_defaults.json');

            if (File::exists($path)) {
                $json = file_get_contents($path);
                $defaults = json_decode($json, true);
            }
            // Insertamos en la tabla pivot
            $product->defaultOptions()->attach($defaults['default_option_ids']);
        }

        // 4. Redirección con mensaje de éxito (Inertia lo maneja de lujo)
        return redirect()->route('admin.products.index')
            ->with('message', '¡La torta se guardó correctamente!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    public function updateDefaultOptions(Request $request, Product $product)
    {
        // 1. Validamos que lleguen IDs y que sean un array
        $request->validate([
            'option_ids' => 'required|array',
            'option_ids.*' => 'exists:custom_options,id', // Verifica que cada ID exista en tu tabla
        ]);

        try {
            // 2. Sincronizamos la tabla pivot 'product_default_options'
            // El método sync recibe el array de IDs directamente
            $product->defaultOptions()->sync($request->option_ids);

            return back()->with('success', 'Receta base actualizada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema al guardar la configuración.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return inertia('admin/products/edit', [
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // dd($request->all(), $product->toArray());

        // 1. Validación
        // Nota: 'image' es 'nullable' porque si no suben una nueva, usamos la anterior.
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'slug' => 'required|string|unique:products,slug,'.$product->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20048',
            'is_featured' => 'boolean',
            'is_customizable' => 'boolean',
        ]);

        // dd($validated);

        // $path = $request->file('image')->store('images/products', 'public');

        // $validated['image'] = $path;

        // 2. Manejo de la Imagen
        if ($request->hasFile('image')) {
            // Borramos la imagen anterior del disco si existe
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                // Storage::disk('public')->delete($product->image); //////////// NO ELIMINAMOS PARA QUE QUEDE HISTÓRICO EN LOS PEDIDOS
            }
            // Guardamos la nueva
            $path = $request->file('image')->store(Product::STORAGE_PATH, 'public');
            $validated['image'] = $path;
        } else {
            // Si no se subió imagen nueva, quitamos 'image' del array
            // para que no intente sobreescribir con null en la DB.
            unset($validated['image']);
        }

        // 3. Actualización
        $product->update($validated);

        // 4. Redirección con Sonner (Inertia)
        return redirect()->route('admin.products.index')
            ->with('message', '¡La torta se actualizó correctamente!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // 1. Obtener el path de la imagen antes de borrar el registro
        $imagePath = $product->image;

        // 2. Eliminar el registro de la DB
        $product->delete();

        // 3. Si el registro se borró y tenía imagen, la eliminamos del disco
        if ($imagePath) {
            // VALIDAMOS SI LA IMAGEN NO EXISTE EN NINGUN REGISTRO DE LA TABLA order_items ANTES DE ELIMINARLA
            $isUsedInOrders = \DB::table('order_items')->where('product_image_at_purchase', $imagePath)->exists();
            if (! $isUsedInOrders) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('message', 'Producto eliminado correctamente.');
    }
}
