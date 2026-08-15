<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use app\Models\User;
use Illuminate\Support\Facades\Storage;
use app\Models\Order;

class ProfileController extends Controller
{
    // /**
    //  * Show the user's profile settings page.
    //  */
    // public function edit(Request $request): Response
    // {
    //     return Inertia::render('settings/profile', [
    //         'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
    //         'status' => $request->session()->get('status'),
    //     ]);
    // }

    // /**
    //  * Update the user's profile information.
    //  */
    // public function update(ProfileUpdateRequest $request): RedirectResponse
    // {
    //     $request->user()->fill($request->validated());

    //     if ($request->user()->isDirty('email')) {
    //         $request->user()->email_verified_at = null;
    //     }

    //     $request->user()->save();

    //     return to_route('profile.edit');
    // }

    // /**
    //  * Delete the user's profile.
    //  */
    // public function destroy(ProfileDeleteRequest $request): RedirectResponse
    // {
    //     $user = $request->user();

    //     Auth::logout();

    //     $user->delete();

    //     $request->session()->invalidate();
    //     $request->session()->regenerateToken();

    //     return redirect('/');
    // }

    /**
     * Muestra el panel del cliente con su histórico y sus datos.
     */
    public function index(Request $request)
    {
        // Traemos los pedidos del usuario autenticado con su estado actual
        $orders = $request->user()->orders()
            ->with('status')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'tracking_token' => $order->tracking_token,
                    'delivery_date' => $order->delivery_date ? $order->delivery_date->format('d/m/Y H:i') : '-',
                    'status_name' => $order->status?->name ?? 'Desconocido',
                    'status_color' => $order->status?->color ?? '#6B7280',
                    'total' => $order->total, // Si manejás montos
                    'items_count' => $order->items()->count(),
                ];
            });

        return Inertia::render('client/dashboard', [
            'orders' => $orders,
            'user' => [
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'phone' => $request->user()->phone, // Suponiendo que tenés este campo
                'avatar_url' => $request->user()->avatar ? asset('storage/' . $request->user()->avatar) : null,
            ]
        ]);
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        // 🌟 Traemos los pedidos del cliente logueado para pasárselos a la vista
        $orders = $request->user()->orders()
            ->with('status')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'tracking_token' => $order->tracking_token,
                    'delivery_date' => $order->delivery_date ? $order->delivery_date->format('d/m/Y H:i') : '-',
                    'status_name' => $order->status?->name ?? 'Desconocido',
                    'status_color' => $order->status?->color ?? '#6B7280',
                    'items_count' => $order->items()->count(),
                ];
            });

        return Inertia::render('settings/profile', [ // Tu vista actual de settings
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'orders' => $orders, // 🌟 Inyectamos el histórico
            'avatar' => $request->user()->avatar ? asset('storage/' . $request->user()->avatar) : null, // 🌟 URL de la foto
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        // El email no es editable desde este formulario; se conserva el actual.
        $user->forceFill([
            'email' => $user->getOriginal('email'),
        ]);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => 'nullable|image|max:1024',
            ]);

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        //  return to_route('profile.edit')->with('success', 'Perfil actualizado.');
        // 🌟 CAMBIO AQUÍ: En vez de to_route('profile.edit'), volvemos atrás limpiamente
        return back()->with('success', 'Perfil actualizado con éxito.');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        // 🌟 Si el usuario se da de baja, limpiamos su avatar del servidor
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
