<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Auth\ProviderController;
use Laravel\Socialite\Facades\Socialite;


Route::get('/auth/google/redirect', [ProviderController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [ProviderController::class, 'callback']);

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Ruta del catálogo (la crearemos después, por ahora que devuelva la Home)
Route::get('/catalogo', function () {
    return Inertia::render('Welcome');
})->name('catalog');



// Ruta de pedidos (solo para logueados)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/mis-pedidos', function () {
        return Inertia::render('Dashboard'); // O una página de pedidos futura
    })->name('orders');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
