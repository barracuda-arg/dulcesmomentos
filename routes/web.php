<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomAttributeController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\AdminFeedbackController;
use App\Http\Controllers\Auth\ProviderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DeliveryRateController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderTrackingController;
use App\Http\Controllers\OrderFeedbackController;
use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\HistoriaController;
use App\Http\Controllers\ContactoController;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas del Sistema y Utilidades
|--------------------------------------------------------------------------
*/
Route::get('/php-info', function () {
    return phpinfo();
});

/*
|--------------------------------------------------------------------------
| Autenticación con Google (OAuth)
|--------------------------------------------------------------------------
*/
Route::get('/auth/google/redirect', [ProviderController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [ProviderController::class, 'callback']);

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Catálogo, Carrito, Novedades y Checkout)
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/producto/{slug}', [HomeController::class, 'show'])->name('products.show');
Route::get('/catalogo', [CatalogController::class, 'index'])->name('catalog.index');

// Carrito de compras y checkout
Route::get('/carrito', [CartController::class, 'index'])->name('cart.index');
Route::get('/finalizar-pedido', [CartController::class, 'checkout'])->name('cart.checkout');
Route::post('/finalizar-pedido', [CartController::class, 'store'])->name('cart.store');
Route::get('/pedido-confirmado/{token}', function ($token) {
    $order = Order::with('status')->where('tracking_token', $token)->firstOrFail();
    return Inertia::render('shop/order-success', ['order' => $order]);
})->name('order.success');

// Sección Revista Pública
Route::get('/novedades', [PostController::class, 'index'])->name('posts.index');
Route::get('/novedades/{slug}', [PostController::class, 'show'])->name('posts.show');

// Seguimiento público de Pedidos y Feedback
Route::get('/buscar-mi-pedido', [OrderTrackingController::class, 'showPublicForm'])->name('order.track.form');
Route::post('/buscar-mi-pedido', [OrderTrackingController::class, 'showPublicForm'])->name('order.track.search');
Route::post('/buscar-mi-pedido/{token}/feedback', [OrderFeedbackController::class, 'store'])->name('order.feedback.store');

Route::get('/nuestra-historia', HistoriaController::class)->name('nuestra-historia');
// Route::get('/contacto', ContactoController::class)->name('contacto');
Route::get('/contacto', [ContactoController::class, 'show'])->name('contacto');
Route::post('/contacto', [ContactoController::class, 'sendContactEmail'])->name('contacto.send');

/*
|--------------------------------------------------------------------------
| Módulo Cliente Autenticado ("Mi Panel" / Historial de Pedidos)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // El "Dashboard" unificado inteligente
    Route::get('/dashboard', function () {
        if (auth()->user()->hasRole('admin')) {
            return redirect()->route('admin.products.index');
        }
        // return redirect()->route('client.dashboard');
        return redirect()->route('home');
    })->name('dashboard');

    // Panel del cliente integrado con tu Settings/ProfileController personalizado
    Route::prefix('mi-panel')->name('client.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('dashboard');
        Route::put('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    });
});

/*
|--------------------------------------------------------------------------
| Módulo Administrativo (Panel de Control de Eliana)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // ABMs Principales
        Route::resource('products', ProductController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('delivery-rates', DeliveryRateController::class)->except(['create', 'show', 'edit']);
        Route::resource('posts', AdminPostController::class);

        // Atributos y Personalizaciones de Tortas
        Route::get('customizations', [CustomAttributeController::class, 'index'])->name('customizations.index');
        Route::post('customizations', [CustomAttributeController::class, 'storeAttribute'])->name('customizations.store');
        Route::put('customizations/{attribute}', [CustomAttributeController::class, 'update'])->name('customizations.update');
        Route::post('customizations/{attribute}/options', [CustomAttributeController::class, 'storeOption'])->name('customizations.options.store');
        Route::match(['post', 'put'], 'customizations/options/{option}', [CustomAttributeController::class, 'updateOption'])->name('customizations.options.update');
        Route::delete('customizations/options/{option}', [CustomAttributeController::class, 'destroyOption'])->name('customizations.options.destroy');

        Route::post('products/{product}/update-defaults', [ProductController::class, 'updateDefaultOptions'])->name('products.update-defaults');

        // Gestión de Pedidos en Local
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        // Usar PATCH es la convención correcta para actualizar estados parciales
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');
        Route::patch('/orders/{order}/update-delivery', [AdminOrderController::class, 'updateDelivery'])->name('orders.updateDelivery');

        // Módulo de Reseñas / Social Proof
        Route::get('/feedbacks', [AdminFeedbackController::class, 'index'])->name('feedbacks.index');
        Route::patch('/feedbacks/{feedback}/toggle-approval', [AdminFeedbackController::class, 'toggleApproval'])->name('feedbacks.toggle');
        Route::post('/feedbacks/{feedback}/update-photo', [AdminFeedbackController::class, 'updatePhoto'])->name('feedbacks.photo');
        Route::delete('/feedbacks/{feedback}/remove-photo', [AdminFeedbackController::class, 'removePhoto'])->name('feedbacks.remove-photo');
        Route::post('/feedbacks/store-manual', [AdminFeedbackController::class, 'storeManual'])->name('feedbacks.store-manual');

        // Carga de imágenes Rich Text (Tiptap)
        Route::post('/posts/upload-image', function (Request $request) {
            $request->validate(['image' => 'required|image|max:2048']);
            $path = $request->file('image')->store('posts/inline-images', 'public');
            return response()->json(['url' => asset('storage/' . $path)]);
        })->name('posts.upload-inline');


        // 🌟 NUEVO: Módulo de Configuración de Contenidos y Variables Globales
        Route::get('/configuracion', [SiteSettingController::class, 'index'])->name('settings.index');
        Route::post('/configuracion/secciones/{section}', [SiteSettingController::class, 'updateSection'])->name('settings.sections.update');
        Route::post('/configuracion/generales', [SiteSettingController::class, 'updateSettings'])->name('settings.generales.update');
    });

/*
|--------------------------------------------------------------------------
| Starter Kit Auth & Settings de Laravel
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';