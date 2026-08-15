<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderTrackingController extends Controller
{
    public function showPublicForm(Request $request)
    {
        $statuses = OrderStatus::orderBy('id')->get();
        // $tokenParam = $request->query('token'); // Captura el ?token=XXXX de la URL
         $tokenParam = $request->input('token');
        // dd($tokenParam);

        // Si NO viene ningún token en la URL, cargamos la página limpia para que tipee
        if (!$tokenParam) {
            return Inertia::render('trackorder', [
                'order' => null,
                'statuses' => $statuses,
                'searchedToken' => null,
                'error' => null,
                'statusEntregado' => Order::STATUS_ENTREGADO, // Le pasamos el ID del estado "Entregado" para que React lo use en el Stepper
                'satatusCancelado' => Order::STATUS_CANCELADO, // Le pasamos el ID del estado "Cancelado" para que React lo use en el Stepper

            ]);
        }

        // Si SÍ viene un token, hacemos la búsqueda automática inmediatamente
        $tokenLimpio = strtoupper(trim($tokenParam));
        $order = Order::with(['items', 'status', 'feedback'])
            ->where('tracking_token', $tokenLimpio)
            ->first();

        return Inertia::render('trackorder', [
            'order' => $order,
            'statuses' => $statuses,
            'searchedToken' => $tokenLimpio,
            'error' => $order ? null : 'No encontramos ningún pedido con el código enviado en el enlace.',
            'statusEntregado' => Order::STATUS_ENTREGADO, // Le pasamos el ID del estado "Entregado" para que React lo use en el Stepper
            'satatusCancelado' => Order::STATUS_CANCELADO, // Le pasamos el ID del estado "Cancelado" para que React lo use en el Stepper
        ]);
    }
    // public function showPublicForm()
    // {
    //     // Renderiza la página de búsqueda vacía
    //     return Inertia::render('trackorder', [
    //         'order' => null,
    //         'statuses' => OrderStatus::orderBy('id')->get() // Aseguramos el orden correlativo de los IDs
    //     ]);
    // }

    // public function searchToken(Request $request)
    // {
    //     $request->validate([
    //         'token' => 'required|string|max:20',
    //     ]);

    //     // Buscamos el pedido con sus ítems (tortas) y su estado actual
    //     $order = Order::with(['items', 'status'])
    //         ->where('tracking_token', strtoupper(trim($request->token)))
    //         ->first();

    //     return Inertia::render('trackorder', [
    //         'order' => $order,
    //         'statuses' => OrderStatus::orderBy('id')->get(),
    //         'searchedToken' => $request->token,
    //         'error' => $order ? null : 'No encontramos ningún pedido con ese código. Verificá si lo escribiste bien.'
    //     ]);
    // }
}