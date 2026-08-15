<?php

namespace App\Http\Controllers;

use App\Models\OrderFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminFeedbackController extends Controller
{
    // public function index()
    // {
    //     // 1. Reemplazamos ->get() por ->paginate(10)
    //     $feedbacks = OrderFeedback::with('order:id,customer_name,tracking_token')
    //         ->latest()
    //         ->paginate(10); // 🌟 Aquí se genera el paginador con data y links

    //     // 2. Usamos through() en lugar de map() para transformar las filas internas
    //     $feedbacksPaginated = $feedbacks->through(function ($fb) {
    //         return [
    //             'id' => $fb->id,
    //             'client' => $fb->order->customer_name,
    //             'token' => $fb->order->tracking_token,
    //             'rating' => $fb->rating,
    //             'comment' => $fb->comment,
    //             'is_approved' => (bool)$fb->is_approved,
    //             'photo_url' => $fb->photo_path ? asset('storage/' . $fb->photo_path) : null,
    //             'created_at' => $fb->created_at->format('d/m/Y H:i'),
    //         ];
    //     });

    //     // 3. Enviamos el objeto paginado y formateado a tu vista de React
    //     return Inertia::render('admin/feedback/index', [
    //         'feedbacksPaginated' => $feedbacksPaginated
    //     ]);
    // }
    public function index(Request $request)
    {
        // Capturamos los filtros de la URL para pasárselos de vuelta a React (mantener los campos llenos)
        $filters = $request->only(['search', 'date', 'status']);

        $feedbacks = OrderFeedback::with('order:id,customer_name,tracking_token')
            ->latest()
            // 🔍 Filtro 1: Texto (Busca por comentario o por nombre del cliente en la relación)
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('order', function($qOrder) use ($search) {
                        $qOrder->where('customer_name', 'like', "%{$search}%");
                    });
                });
            })
            // 📅 Filtro 2: Fecha (Compara la fecha exacta de creación)
            ->when($request->date, function ($query, $date) {
                $query->whereDate('created_at', $date);
            })
            // 👁️ Filtro 3: Visibilidad (Aprobados o Ocultos)
            ->when($request->status, function ($query, $status) {
                if ($status === 'visibles') {
                    $query->where('is_approved', true);
                } elseif ($status === 'ocultos') {
                    $query->where('is_approved', false);
                }
            })
            ->paginate(10);

        // Formateamos los registros usando through() como ya tenías configurado
        $feedbacksPaginated = $feedbacks->through(function ($fb) {
            return [
                'id' => $fb->id,
                'client' => $fb->order ? $fb->order->customer_name : $fb->manual_customer_name, // $fb->order->customer_name,
                'token' => $fb->order ? $fb->order->tracking_token : 'MANUAL (WhatsApp)', // $fb->order->tracking_token,
                'rating' => $fb->rating,
                'comment' => $fb->comment,
                'is_approved' => (bool)$fb->is_approved,
                'photo_url' => $fb->photo_path ? asset('storage/' . $fb->photo_path) : null,
                'created_at' => $fb->created_at->format('d/m/Y H:i'),
            ];
        });

        // Resolvemos al estilo de tu opción A para React
        return Inertia::render('admin/feedback/index', [
            'feedbacksPaginated' => $feedbacksPaginated, // $feedbacksPaginated->response()->getData(true),
            'filters' => $filters // 🌟 Mandamos los filtros actuales para que React los dibuje
        ]);
    }

    // 1. Cambiar estado de aprobación (Toggle)
    public function toggleApproval(OrderFeedback $feedback)
    {
        $feedback->update([
            'is_approved' => !$feedback->is_approved
        ]);

        return back()->with('success', 'Estado de aprobación actualizado.');
    }

    // 2. Reemplazar o subir foto representativa
    public function updatePhoto(Request $request, OrderFeedback $feedback)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        // Si ya tenía una foto previa, la borramos del disco para no acumular basura
        if ($feedback->photo_path) {
            Storage::disk('public')->delete($feedback->photo_path);
        }

        // Guardamos la nueva foto elegida por Eliana
        $path = $request->file('photo')->store('feedbacks', 'public');

        $feedback->update([
            'photo_path' => $path
        ]);

        return back()->with('success', 'Foto del producto actualizada con éxito.');
    }

    public function removePhoto(OrderFeedback $feedback)
    {
        // Si efectivamente tiene una foto en el disco, la eliminamos
        if ($feedback->photo_path) {
            Storage::disk('public')->delete($feedback->photo_path);
        }

        // Devolvemos el campo a null
        $feedback->update([
            'photo_path' => null
        ]);

        return back()->with('success', 'Se quitó la foto de la reseña.');
    }

    // public function store(Request $request)
    // {
    //     // Aquí podrías implementar la lógica para crear un nuevo feedback desde el panel admin
    //     // Validar los datos, crear el registro en la base de datos, etc.
    //     // Por ahora, solo redirigimos de vuelta con un mensaje de éxito simulado.

    //     return back()->with('success', '¡Nuevo comentario creado exitosamente! (Funcionalidad por implementar)');
    // }
    public function storeManual(Request $request)
    {
        $validated =$request->validate([
            'customer_name' => 'required|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        // dd([$validated, $request->customer_name]);
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('feedbacks', 'public');
        }
        // Guardamos en la base de datos
        OrderFeedback::create([
            'order_id' => null, // 🌟 Al ser manual, no tiene pedido enlazado
            'manual_customer_name' => $request->customer_name, // Guardamos su nombre en un campo alternativo
            'rating' => $request->rating,
            'comment' => $request->comment,
            'photo_path' => $photoPath,
            'is_approved' => true // 🌟 Al ser cargada por Eliana, ya nace aprobada y visible
        ]);

        return back()->with('success', 'Reseña manual guardada con éxito.');
    }
}