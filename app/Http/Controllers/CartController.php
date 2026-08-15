<?php

namespace App\Http\Controllers;

use App\Models\CustomOption;
use App\Models\DeliveryRate;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemOptions;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    use HasFactory;

    public function index()
    {

        // return Inertia::render('Cart', [
        //         // ... tus props del carrito actuales
        //         'deliveryRates' => DeliveryRate::orderBy('max_distance_km', 'asc')->get()
        //     ]);

        return Inertia::render('shop/cart', [
            'deliveryRates' => DeliveryRate::orderBy('max_distance_km', 'asc')->get(),
        ]); // El archivo que creamos antes
    }

    public function checkout()
    {
        return Inertia::render('shop/checkout'); // El que haremos a continuación
    }

    public function formatPhone($phone)
    {
        // Llega como "+543875203350"
        // Elimina cualquier carácter que no sea un número
        $phoneClean = preg_replace('/\D/', '', $phone);

        // 1. Limpiamos el '+' y cualquier caracter extraño

        // 2. Metemos el '9' de WhatsApp si detectamos que es un número de Argentina y no lo tiene
        if (str_starts_with($phoneClean, '54') && !str_starts_with($phoneClean, '549')) {
            // Reemplaza el '54' del inicio por '549'
            $phoneClean = '549' . substr($phoneClean, 2); // Queda "5493875203350"
        }

        return $phoneClean;
    }
    public function store(Request $request)
    {

        // dd($request->all());

        // array:13 [▼ // app/Http/Controllers/CartController.php:30
        //   "customer_name" => null
        //   "customer_email" => null
        //   "customer_phone" => null
        //   "delivery_address" => "Retiro en local (Gratis)"
        //   "delivery_cost" => 0
        //   "delivery_distance" => null
        //   "delivery_lat" => null
        //   "delivery_lng" => null
        //   "is_delivery" => false
        //   "delivery_date" => null
        //   "delivery_time_slot" => "tarde"
        //   "notes" => null
        //   "cart_items" => array:3 [▼
        //     0 => array:8 [▶]
        //     1 => array:8 [▶]
        //     2 => array:8 [▶]
        //   ]
        // ]
        // 1. Validar los datos del formulario "bobo"
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string',
            'customer_email' => 'nullable|email',
            'delivery_address' => 'required|string',

            // Campos de delivery que ahora sí viajan en $validated:
            'is_delivery' => 'required|boolean',
            'delivery_cost' => 'nullable|numeric|min:0',
            'delivery_distance' => 'nullable|string',
            'delivery_lat' => 'nullable|numeric',
            'delivery_lng' => 'nullable|numeric',

//             'delivery_date' => 'required|date|after_or_equal:today',
            'date_part' => 'required|date|after_or_equal:today',
            'time_part' => 'required|date_format:H:i',
            // 'delivery_time_slot' => 'required|in:mañana,tarde',
            'notes' => 'nullable|string',
            'cart_items' => 'required|array|min:1',
        ]);

        // dd($validated);
        // array:13 [▼ // app/Http/Controllers/CartController.php:73
        //   "customer_name" => "Juan Perez"
        //   "customer_phone" => "3874496441"
        //   "customer_email" => null
        //   "delivery_address" => "Vuelta de Obligado 459, A4400 Salta, Argentina"
        //   "is_delivery" => true
        //   "delivery_cost" => 2500
        //   "delivery_distance" => "3.3 km"
        //   "delivery_lat" => -24.7985323
        //   "delivery_lng" => -65.4483381
        //   "delivery_date" => "2026-05-22"
        //   "delivery_time_slot" => "tarde"
        //   "notes" => null
        //   "cart_items" => array:1 [▼
        //     0 => array:8 [▼
        //       "cartId" => "1779118938134"
        //       "product_id" => 1
        //       "name" => "Torta Especial Para Ellas"
        //       "image" => "/images/products/demo-1.jpg"
        //       "price_at_purchase" => 25000
        //       "quantity" => 1
        //       "subtotal" => 25000
        //       "selections" => array:5 [▼
        //         1 => array:2 [▼
        //           0 => array:11 [▼
        //             "id" => 1
        //             "custom_attribute_id" => 1
        //             "name" => "Dulce de Leche"
        //             "description" => "El relleno de Dulce de Leche posee una textura suave y cremosa y se prepara con productos de mejor calidad."
        //             "image" => "images/options/demo-1.jpg"
        //             "additional_price" => "0.00"
        //             "is_active" => true
        //             "created_at" => "2026-05-18T14:29:53.000000Z"
        //             "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             "pivot" => array:2 [▶]
        //             "attribute" => array:9 [▼
        //               "id" => 1
        //               "name" => "Rellenos"
        //               "description" => null
        //               "is_multiple" => true
        //               "is_required" => true
        //               "step_number" => 2
        //               "is_active" => true
        //               "created_at" => "2026-05-18T14:29:53.000000Z"
        //               "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             ]
        //           ]
        //           1 => array:11 [▼
        //             "id" => 3
        //             "custom_attribute_id" => 1
        //             "name" => "Crema Chantilly con durazno"
        //             "description" => "El relleno de Crema Chantilly con durazno posee una textura suave y cremosa y se prepara con productos de mejor calidad."
        //             "image" => "images/options/demo-3.jpg"
        //             "additional_price" => "0.00"
        //             "is_active" => true
        //             "created_at" => "2026-05-18T14:29:53.000000Z"
        //             "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             "pivot" => array:2 [▶]
        //             "attribute" => array:9 [▼
        //               "id" => 1
        //               "name" => "Rellenos"
        //               "description" => null
        //               "is_multiple" => true
        //               "is_required" => true
        //               "step_number" => 2
        //               "is_active" => true
        //               "created_at" => "2026-05-18T14:29:53.000000Z"
        //               "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             ]
        //           ]
        //         ]
        //         2 => array:1 [▼
        //           0 => array:11 [▼
        //             "id" => 10
        //             "custom_attribute_id" => 2
        //             "name" => "Vainilla"
        //             "description" => "Bizcochuelo sabor vainilla."
        //             "image" => "images/options/demo-10.jpg"
        //             "additional_price" => "0.00"
        //             "is_active" => true
        //             "created_at" => "2026-05-18T14:29:53.000000Z"
        //             "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             "pivot" => array:2 [▶]
        //             "attribute" => array:9 [▼
        //               "id" => 2
        //               "name" => "Bizcochuelos"
        //               "description" => null
        //               "is_multiple" => true
        //               "is_required" => true
        //               "step_number" => 1
        //               "is_active" => true
        //               "created_at" => "2026-05-18T14:29:53.000000Z"
        //               "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             ]
        //           ]
        //         ]
        //         3 => array:1 [▼
        //           0 => array:11 [▼
        //             "id" => 12
        //             "custom_attribute_id" => 3
        //             "name" => "Chantilly"
        //             "description" => "Bizcochuelo con cubierta de Chantilly."
        //             "image" => "images/options/demo-12.jpg"
        //             "additional_price" => "0.00"
        //             "is_active" => true
        //             "created_at" => "2026-05-18T14:29:53.000000Z"
        //             "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             "pivot" => array:2 [▶]
        //             "attribute" => array:9 [▼
        //               "id" => 3
        //               "name" => "Coberturas"
        //               "description" => null
        //               "is_multiple" => false
        //               "is_required" => true
        //               "step_number" => 3
        //               "is_active" => true
        //               "created_at" => "2026-05-18T14:29:53.000000Z"
        //               "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             ]
        //           ]
        //         ]
        //         4 => array:1 [▼
        //           0 => array:11 [▼
        //             "id" => 15
        //             "custom_attribute_id" => 4
        //             "name" => "Laminas comestibles"
        //             "description" => "Láminas comestibles para decoración."
        //             "image" => "images/options/demo-15.jpg"
        //             "additional_price" => "5000.00"
        //             "is_active" => true
        //             "created_at" => "2026-05-18T14:29:53.000000Z"
        //             "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             "pivot" => array:2 [▶]
        //             "attribute" => array:9 [▼
        //               "id" => 4
        //               "name" => "Extras/Toppers"
        //               "description" => null
        //               "is_multiple" => true
        //               "is_required" => false
        //               "step_number" => 4
        //               "is_active" => true
        //               "created_at" => "2026-05-18T14:29:53.000000Z"
        //               "updated_at" => "2026-05-18T14:29:53.000000Z"
        //             ]
        //           ]
        //         ]
        //         6 => array:1 [▼
        //           0 => array:7 [▼
        //             "id" => 19
        //             "name" => "1 kg"
        //             "description" => "Torta de 1 kg kilogramos."
        //             "image" => "images/options/demo-19.jpg"
        //             "additional_price" => "20000.00"
        //             "is_active" => true
        //             "attribute" => array:4 [▼
        //               "id" => 6
        //               "name" => "Peso"
        //               "is_multiple" => false
        //               "step_number" => 5
        //             ]
        //           ]
        //         ]
        //       ]
        //     ]
        //   ]
        // ]
        try {
            $order = \DB::transaction(function () use ($validated) {

                $customerPhone = $this->formatPhone($validated['customer_phone']);

                // 2. Calcular el total general sumando los subtotales del carrito
                $itemsAmount = collect($validated['cart_items'])->sum(function ($item) {
                    return $item['subtotal'] * $item['quantity'];
                });
                $deliveryCost = ($validated['delivery_cost'] && $validated['delivery_cost'] > 0) ? $validated['delivery_cost'] : 0;

                // 3. Crear la cabecera del pedido (ORDERS)
                $order = Order::create([
                    'tracking_token' => 'DZ-'.strtoupper(Str::random(6)), // Genera algo como DZ-X92Y1Z
                    'user_id' => auth()->id(), // NULL si es invitado
                    'order_status_id' => 1, // "Solicitado" según tu Seeder
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $customerPhone,

                    'is_delivery' => $validated['is_delivery'] > 0 ? true : false,
                    'delivery_address' => $validated['delivery_address'],
                    'delivery_lat' => $validated['delivery_lat'] ?? null,
                    'delivery_lng' => $validated['delivery_lng'] ?? null,
                    'delivery_distance' => $validated['delivery_distance'] ?? null,
                    'delivery_cost' => $deliveryCost,
                    // 'delivery_date' => $validated['delivery_date'],
                    'delivery_date' => $validated['date_part'] . ' ' . $validated['time_part'] . ':00',

                    // 'notes' => "Entrega: {$validated['delivery_date']} ({$validated['delivery_time_slot']}). ".($validated['notes'] ?? ''),
                    'notes' => ($validated['notes'] ?? ''),
                    'items_amount' => $itemsAmount,
                    'total_amount' => $itemsAmount + $deliveryCost,
                ]);

                // 4. Crear cada item del pedido (ORDER_ITEMS)
                foreach ($validated['cart_items'] as $item) {
                    $product = Product::find($item['product_id']);
                    // dd($product->image);
                    $oi = OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'product_name' => $item['name'],
                        'product_image_at_purchase' => $product->image, // Guardamos la foto actual
                        'selections' => $item['selections'], // Laravel lo convierte a JSON automáticamente por el cast en el Modelo
                        'quantity' => $item['quantity'],
                        'price_at_purchase' => $item['subtotal'],
                        'subtotal' => $item['subtotal'] * $item['quantity'],
                    ]);

                    // dd($oi->selections);
                    // array:5 [▼ // app/Http/Controllers/CartController.php:286
                    //   1 => array:2 [▼
                    //     0 => array:11 [▼
                    //       "id" => 1
                    //       "custom_attribute_id" => 1
                    //       "name" => "Dulce de Leche"
                    //       "description" => "El relleno de Dulce de Leche posee una textura suave y cremosa y se prepara con productos de mejor calidad."
                    //       "image" => "images/options/demo-1.jpg"
                    //       "additional_price" => "0.00"
                    //       "is_active" => true
                    //       "created_at" => "2026-05-18T14:29:53.000000Z"
                    //       "updated_at" => "2026-05-18T14:29:53.000000Z"
                    //       "pivot" => array:2 [▶]
                    //       "attribute" => array:9 [▶]
                    //     ]
                    //     1 => array:11 [▼
                    //       "id" => 3
                    //       "custom_attribute_id" => 1
                    //       "name" => "Crema Chantilly con durazno"
                    //       "description" => "El relleno de Crema Chantilly con durazno posee una textura suave y cremosa y se prepara con productos de mejor calidad."
                    //       "image" => "images/options/demo-3.jpg"
                    //       "additional_price" => "0.00"
                    //       "is_active" => true
                    //       "created_at" => "2026-05-18T14:29:53.000000Z"
                    //       "updated_at" => "2026-05-18T14:29:53.000000Z"
                    //       "pivot" => array:2 [▶]
                    //       "attribute" => array:9 [▶]
                    //     ]
                    //   ]
                    //   2 => array:1 [▼
                    //     0 => array:11 [▼
                    //       "id" => 10
                    //       "custom_attribute_id" => 2
                    //       "name" => "Vainilla"
                    //       "description" => "Bizcochuelo sabor vainilla."
                    //       "image" => "images/options/demo-10.jpg"
                    //       "additional_price" => "0.00"
                    //       "is_active" => true
                    //       "created_at" => "2026-05-18T14:29:53.000000Z"
                    //       "updated_at" => "2026-05-18T14:29:53.000000Z"
                    //       "pivot" => array:2 [▶]
                    //       "attribute" => array:9 [▶]
                    //     ]
                    //   ]
                    //   3 => array:1 [▼
                    //     0 => array:11 [▼
                    //       "id" => 12
                    //       "custom_attribute_id" => 3
                    //       "name" => "Chantilly"
                    //       "description" => "Bizcochuelo con cubierta de Chantilly."
                    //       "image" => "images/options/demo-12.jpg"
                    //       "additional_price" => "0.00"
                    //       "is_active" => true
                    //       "created_at" => "2026-05-18T14:29:53.000000Z"
                    //       "updated_at" => "2026-05-18T14:29:53.000000Z"
                    //       "pivot" => array:2 [▶]
                    //       "attribute" => array:9 [▶]
                    //     ]
                    //   ]
                    //   4 => array:1 [▼
                    //     0 => array:11 [▼
                    //       "id" => 15
                    //       "custom_attribute_id" => 4
                    //       "name" => "Laminas comestibles"
                    //       "description" => "Láminas comestibles para decoración."
                    //       "image" => "images/options/demo-15.jpg"
                    //       "additional_price" => "5000.00"
                    //       "is_active" => true
                    //       "created_at" => "2026-05-18T14:29:53.000000Z"
                    //       "updated_at" => "2026-05-18T14:29:53.000000Z"
                    //       "pivot" => array:2 [▶]
                    //       "attribute" => array:9 [▶]
                    //     ]
                    //   ]
                    //   6 => array:1 [▼
                    //     0 => array:7 [▼
                    //       "id" => 19
                    //       "name" => "1 kg"
                    //       "description" => "Torta de 1 kg kilogramos."
                    //       "image" => "images/options/demo-19.jpg"
                    //       "additional_price" => "20000.00"
                    //       "is_active" => true
                    //       "attribute" => array:4 [▶]
                    //     ]
                    //   ]
                    // ]
                    $flatLeaves = collect($oi->selections)->collapse();
                    foreach ($flatLeaves as $sel) {
                        $option = CustomOption::find($sel['id']);
                        OrderItemOptions::create([
                            'order_item_id' => $oi->id,
                            'custom_option_id' => $sel['id'],
                            'name_at_purchase' => $option->name,
                            'price_at_purchase' => $option->additional_price,
                            'description_at_purchase' => $option->description,
                            'image_at_purchase' => $option->image,
                            'attribute_id_at_purchase' => $option->custom_attribute_id,
                            'attribute_name_at_purchase' => $option->attribute->name,
                            'attribute_step_number_at_purchase' => $option->attribute->step_number,
                        ]);
                    }
                    // dd($oi);
                }

                return $order;
            });

            /////////////////
            $whatsappEnviado = $this->sendWhatsAppNotification($order);
            $msgWhatsApp = $whatsappEnviado
                ? 'Hemos enviado una notificación a tu WhatsApp con el enlace para seguir tu pedido en tiempo real.'
                : 'No nos pudimos comunicar con el Telefono de contacto ' . $order->customer_phone .
                '. Pero no te preocupes, igualmente podrás seguir tu pedido con el código de seguimiento que te asignamos desde la opción' .
                ' "Seguir mi pedido" en nuestra página principal' .
                ' y también podrás comunicarte con nosotros al siguiente Whatsapp ' . env('WHATSAPP_DULCES_MOMENTOS') . ' para más información sobre tu pedido.';
            // Log::info("Resultado del envío de WhatsApp para el pedido {$order->tracking_token


            // 5. Redirigir a una página de éxito con el token
            return redirect()->route('order.success', $order->tracking_token)
                ->with('message', '¡Pedido recibido con éxito! ' . $msgWhatsApp);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Hubo un problema al procesar tu pedido: '.$e->getMessage()]);
        }
    }

    protected function sendWhatsAppNotification(Order $order)
    {
        $ret = false;
        // ... Dentro del método donde se confirma el pedido ...

        // 1. Limpiamos y formateamos el teléfono del cliente (dejamos solo números)
        // $phoneClean = preg_replace('/\D/', '', $order->customer_phone);

        // // 2. Nos aseguramos de armar el prefijo internacional (54 + 9 + área + número)
        // // Si el cliente ya lo guardó con 54, genial. Si no, se lo anteponemos.
        // if (!str_starts_with($phoneClean, '54')) {
        //     $phoneClean = '549' . $phoneClean;
        // }

        // 3. Cocinamos el mensaje con el token dinámico para el Stepper
        $tokenUrl = route('order.track.form', ['token' => $order->tracking_token]);

        $mensaje = "🎂 *¡Tu pedido en Dulces Momentos fue recibido correctamente!* ✨\n\n"
                . "Hola *" . $order->customer_name . "*, en breve nos pondremos en contacto para confirmar detalles de entrega.\n\n"
                . "🔗 *Seguimiento en tiempo real:* Mientras tanto Podés ver en qué estado se encuentra tu torta en cualquier momento haciendo clic acá:\n"
                . $tokenUrl;

        // 4. Despachamos la orden a tu servidor de Node
        try {
            $response = Http::post(config('app.whatsapp_bot_url') . '/api/send', [
                'phone' => $order->customer_phone, // El número del cliente (ya formateado)
                'message' => $mensaje
            ]);

            if ($response->successful()) {
                $ret = true;
                Log::info("WhatsApp enviado con éxito al cliente del pedido: " . $order->tracking_token);
            } else {
                Log::error("El bot de WhatsApp devolvió un error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("No se pudo conectar con el microservicio de WhatsApp: " . $e->getMessage());
        }
        return $ret;
    }
}
