<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrderFeedbackController extends Controller
{
public function store(Request $request, $token)
    {
        // 1. Buscamos el pedido por token
        $order = Order::where('tracking_token', $token)->firstOrFail();

        // 2. REGLA DE NEGOCIO 1: Validar que el pedido esté realmente ENTREGADO
        // Suponiendo que el ID del estado "Entregado" es 6 (cambialo por tu constante si es otra)
        $statusEntregadoId = 6;
        if ($order->order_status_id !== $statusEntregadoId) {
            return back()->withErrors([
                'error' => 'No podés dejar una reseña de un pedido que aún no ha sido entregado.'
            ]);
        }

        // 3. REGLA DE NEGOCIO 2: Evitar duplicados (Bloquear si ya tiene feedback)
        if ($order->feedback()->exists()) {
            return back()->withErrors([
                'error' => 'Este pedido ya cuenta con una calificación registrada.'
            ]);
        }

        // 4. Validación de los inputs de la reseña
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'photo' => 'nullable|image|max:2048', // Max 2MB
        ]);

        // 5. Procesamiento de la imagen opcional
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('feedbacks', 'public');
        }

        try {
            // 6. Creamos la relación de feedback de manera segura
            $order->feedback()->create([
                'rating' => $request->rating,
                'comment' => $request->comment,
                'photo_path' => $photoPath,
            ]);
        } catch (\Exception $e) {
            // Si algo explota al guardar en la BD, borramos la foto del storage para no dejar basura físico
            if ($photoPath) {
                Storage::disk('public')->delete($photoPath);
            }
            throw $e;
        }

        return back()->with('success', '¡Gracias por tu comentario! Nos ayuda mucho a seguir creciendo.');
    }
}