<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $section = PageSection::where('slug', 'catalogo')->firstOrFail();
        // Capturamos los filtros de la URL
        $search = $request->input('buscar'); // 🌟 NUEVO

        // 1. Capturamos la categoría activa desde la URL (?categoria=...)
        $selectedCategory = $request->input('categoria');

        // 2. Traemos las categorías para la barra de filtros rápidos
        $categories = Category::select('id', 'name', 'slug')
            ->whereHas('products') // Opcional: solo muestra categorías que tengan stock/productos
            ->get();

        // 3. Consultamos los productos con su categoría enlazada
        $productsQuery = Product::with('category:id,name')
            ->where('is_active', true); // Aseguramos mostrar solo lo que Eliana tenga activo

        // 🌟 NUEVO: Filtro por nombre de producto (búsqueda)
        $productsQuery->when($search, function ($query, $searchTerm) {
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        });

        // 4. Aplicamos el filtro dinámico si el usuario seleccionó una categoría
        $productsQuery->when($selectedCategory, function ($query, $categorySlug) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        });

        // 5. Paginamos (por ejemplo, de a 9 productos para armar una linda grilla de 3x3)
        $productsPaginated = $productsQuery->latest()->paginate(9);

        // 6. Formateamos la respuesta limpia para Inertia sin romper el paginador nativo
        $productsFormatted = $productsPaginated->through(function ($product) {
            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                // Si manejás imágenes, apuntamos al storage público, sino un placeholder estético
                'image_url' => $product->image ? $product->image : '/images/placeholder-cake.jpg',
                'category_name' => $product->category->name,
            ];
        });

        // 7. Renderizamos la vista pública en React
        return Inertia::render('catalog/index', [
            'productsPaginated' => $productsFormatted,
            'categories' => $categories,
            'currentCategory' => $selectedCategory, // Para saber qué botón pintar de rosa intenso
            'section' => [
                'title' => $section->title,
                'description' => $section->description,
                'content' => $section->content,
                'image_url' => $section->image_path // ? asset('storage/' . $section->image_path) : null,
            ],
            'filters' => [
                'buscar' => $search // 🌟 Mandamos el término actual de vuelta al frontend
            ]
        ]);
    }
}