<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    // Listar todos los pedidos (del más reciente al más viejo)
    public function index(Request $request)
    {

        // return Inertia::render('admin/orders/index', [
        //     'orders' => Order::with('status')->with('items')->latest()->get(),
        //     'statuses' => OrderStatus::orderBy('sort_order')->get(),
        // ]);
        $query = Order::query()->with(['items', 'status']); // Asumiendo tus relaciones

        // Filtro por nombre de cliente
        if ($request->filled('search_customer')) {
            $query->where('customer_name', 'like', '%' . $request->search_customer . '%');
        }

        // Filtro por estado
        if ($request->filled('status_id')) {
            $query->where('order_status_id', $request->status_id);
        }

        // Filtro por fecha exacta de entrega (ignorando la hora para la búsqueda)
        if ($request->filled('date')) {
            $query->whereDate('delivery_date', $request->date);
        }

        // Filtro por aproximación del nombre del producto (torta)
        if ($request->filled('search_product')) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->where('product_name', 'like', '%' . $request->search_product . '%');
            });
        }

        return Inertia::render('admin/orders/index', [
            // 'orders' => $query->latest()->get(),
            'orders' => $query->latest()->paginate(10)->withQueryString(),
            // 'statuses' => OrderStatus::all(),
            'statuses' => OrderStatus::orderBy('sort_order')->get(),
            // Le devolvemos los filtros actuales para que React los pinte en los inputs
            'filters' => $request->only(['search_customer', 'status_id', 'date', 'search_product']),
            'satatusCancelado' => Order::STATUS_CANCELADO,
        ]);
    }

    // Cambiar el estado de un pedido
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'order_status_id' => 'required|exists:order_statuses,id',
        ]);

        $order->update([
            'order_status_id' => $request->order_status_id,
        ]);

        return back()->with('message', 'Estado del pedido actualizado.');
    }


    public function updateDelivery(Request $request, Order $order)
    {
        $request->validate([
            'date_part' => 'required|date',
            'time_part' => 'required|string',
        ]);

        // Unificamos los dos campos en un segundo y lo guardamos en tu columna DATETIME
        $order->update([
            'delivery_date' => $request->date_part . ' ' . $request->time_part . ':00'
        ]);

        return back()->with('success', 'Fecha de Entrega actualizada.');
    }

    // public function updateDelivery(Request $request, Order $order)
    // {
    //     // dd($order);
    //     // dd($request->collect());
    //     $request->validate([
    //         'delivery_date' => 'required',
    //     ]);

    //     $order->update([
    //         'delivery_date' => $request->delivery_date,
    //     ]);
    //     // dd($order);

    //     return back()->with('message', 'Fecha de Entrega actualizada.');
    // }

}
