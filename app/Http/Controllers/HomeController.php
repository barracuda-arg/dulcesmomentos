<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomAttributeResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\CustomAttribute;
use App\Models\Product;
use Inertia\Inertia;
use laravel\Fortify\Features;
use App\Models\OrderFeedback;

class HomeController extends Controller
{
    public function index()
    {


        // Traemos las reseñas aprobadas con los datos del cliente del pedido
        $dbFeedbacks = OrderFeedback::where('is_approved', true)
            ->with('order:id,customer_name') // Traemos solo el ID y el Nombre para optimizar
            ->latest() // Las más nuevas primero
            ->get()
            ->map(function ($feedback) {
                return [
                    // Mapeamos la estructura para que coincida exactamente con tu JSON de React
                    'id' => 'db-' . $feedback->id, // Prefijo para evitar choques de IDs con el hardcodeado
                    'client' => $feedback->order ? $feedback->order->customer_name : $feedback->manual_customer_name,
                    'comment' => $feedback->comment,
                    // Si subió foto, armamos la URL pública. Si no, dejamos null o una por defecto
                    'productImage' => $feedback->photo_path ? asset('storage/' . $feedback->photo_path) : null,
                    'rating' => $feedback->rating
                ];
            });



        // Traemos los productos de "Tentaciones Diarias"
        $dailyTemptations = Product::paraEntregaInmediata()
            ->where('is_active', true)
            ->get();

        $products = Product::paraEntregaPorPedido()
            ->where('is_featured', true)
            ->with('category') // prueba de resource para evitar N+1
            ->with('defaultOptions.attribute') // Cargamos las opciones por defecto con su atributo para evitar N+1
            ->latest()
            ->get();

        return Inertia::render('welcome', [
            // Pasamos las constantes de configuración que ya tenías
            'canRegister' => Features::enabled(Features::registration()),

            // Traemos las categorías para el menú de filtros
            'categories' => Category::hasProducts()
                ->paraEntregaPorPedido()
                ->orderBy('name')
                ->get(),

            // Traemos solo los productos destacados para la Home
            // Usamos 'with' para evitar el problema de consultas N+1 con las categorías
            'products' => $products, // ProductResource::collection($products),

            'dailyTemptations' => $dailyTemptations,
            'approvedFeedbacks' => $dbFeedbacks
        ]);
    }

    // public function show($slug)
    // {
    //     // Buscamos por slug y verificamos que esté activo
    //     $product = Product::where('slug', $slug)
    //         ->where('is_active', true)
    //         ->firstOrFail();

    //     // Solo cargamos los atributos si el producto es customizable
    //     $customizations = [];
    //     if ($product->is_customizable) {
    //         $customizations = CustomAttribute::with(['options' => function ($query) {
    //                 $query->where('is_active', true); // Solo lo que hay en stock
    //         }])
    //         ->where('is_active', true)
    //         ->orderBy('step_number') // 👈 Tu nueva columna
    //         ->get();
    //     }

    //     return Inertia::render('show-product', [
    //         'product' => $product,
    //         'steps' => $customizations,
    //     ]);
    // }

    // // Cargamos el producto con sus categorías, sus atributos posibles
    //     // Y sus opciones por defecto
    //     $product->load([
    //         'category',
    //         'defaultOptions.attribute', // Importante cargar el atributo para saber a qué grupo pertenece cada opción
    //         'customAttributes.options'
    //     ]);

    //     'initialSelections' => $product->defaultOptions->groupBy('custom_attribute_id')
    public function show($slug)
    {
        // 1. Buscamos el producto
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category']) // Cargamos categoría de paso
            ->with('defaultOptions') // Cargamos las opciones por defecto con su atributo
            ->firstOrFail();

        // 2. Cargamos las opciones por defecto (La "Receta Base")
        // Esto es lo nuevo que agregamos con la tabla pivot
        // $product->load(['defaultOptions.attribute']);

        $customizations = [];
        if ($product->is_customizable) {
            // Mantenemos tu lógica de traer los atributos ordenados
            $customizations = CustomAttribute::with(['options' => function ($query) {
                $query->where('is_active', true);
            }])
                ->where('is_active', true)
                ->orderBy('step_number')
                ->get();
        }
        // dd($customizations);
        // dd($customizations->pluck('name'));
        // dd(CustomAttributeResource::collection($customizations));

        return Inertia::render('show-product', [
            'product' => $product,
            // 'steps' => $customizations,
            'stepsObj' => CustomAttributeResource::collection($customizations),
            // Enviamos las opciones iniciales formateadas para React
            'initialSelections' => $product->defaultOptions->groupBy('custom_attribute_id'),
            // 'initialSelections' => ProductResource::collection($product),
        ]);
    }
}
