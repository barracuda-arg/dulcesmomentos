import React, { useState, useEffect } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MessageCircle, Eye, X } from 'lucide-react'; // Usamos Lucide para los iconos
import { ImageZoom } from '@/pages/zoom';
import { ImageModal } from '@/components/ImageModal';
import { SafeHtml } from '@/components/safe-html';
import { OrderStatusSelect } from '@/components/OrderStatusSelect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TimePicker } from '@/components/shared/time-picker';

export default function OrderIndex({ orders, statuses, auth, filters, satatusCancelado }) {
    console.log('------------------', orders);
    const [selectedOrder, setSelectedOrder] = useState(null);


    const [isOpen, setIsOpen] = useState(false); // 👈 Nuevo estado para controlar el modal
    const [selectedOrderDate, setSelectedOrderDate] = useState(null);
    const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [oldStatus, setOldStatus] = useState<object | null>(null);
    const [showCancelReason, setShowCancelReason] = useState(false);

    // Estados locales para los campos de filtro, inicializados con lo que ya venga en la URL
    const [searchCustomer, setSearchCustomer] = useState(filters.search_customer || '');
    const [searchProduct, setSearchProduct] = useState(filters.search_product || '');
    const [statusId, setStatusId] = useState(filters.status_id || '');
    const [filterDate, setFilterDate] = useState(filters.date || '');

    // Inicializamos el formulario siempre vacío o con valores por defecto directos
    const { data, setData, patch, processing, errors, reset } = useForm({
        date_part: '',
        time_part: '18:00',
    });
    // 🛡️ ¡ACÁ ESTÁ LA SOLUCIÓN! Actualizamos el formulario cuando el usuario selecciona un pedido
    useEffect(() => {
        if (selectedOrderDate && selectedOrderDate.delivery_date) {
            const parts = selectedOrderDate.delivery_date.split(' ');
            const fechaParte = parts[0];
            const horaParte = parts[1] || '18:00';

            // Validamos si la fecha viene formateada de la BD como "DD/MM/YYYY" o "YYYY-MM-DD"
            let formatoFechaInput = '';

            if (fechaParte.includes('/')) {
                const [dia, mes, anio] = fechaParte.split('/');
                formatoFechaInput = `${anio}-${mes}-${dia}`;
            } else {
                formatoFechaInput = fechaParte.substring(0, 10);
            }

            // Seteamos ambos valores en el useForm al mismo tiempo
            setData({
                date_part: formatoFechaInput,
                time_part: horaParte.substring(0, 5),
            });
        } else {
            // Si se limpia el pedido seleccionado, reseteamos el formulario
            reset();
        }
    }, [selectedOrderDate]);

    // 🛡️ EFECTO DE FILTRADO: Escucha cuando cambian los inputs y actualiza la URL con Inertia
    useEffect(() => {
        // Usamos un pequeño timeout (Debounce) para los inputs de texto.
        // Así evitamos saturar a Laravel con requests idénticos por cada tecla que Eliana tipee.
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.orders.index'), // Asegurate que sea el nombre correcto de tu ruta
                {
                    search_customer: searchCustomer,
                    search_product: searchProduct,
                    status_id: statusId,
                    date: filterDate,
                },
                {
                    preserveState: true, // Evita que se cierren modales o se pierda el foco
                    replace: true,       // No llena el historial del navegador de páginas idénticas
                }
            );
        }, 400); // Espera 400ms después de que dejó de escribir

        return () => clearTimeout(delayDebounceFn);
    }, [searchCustomer, searchProduct, statusId, filterDate]);


    // Función rápida para limpiar todos los filtros de golpe
    const handleClearFilters = () => {
        setSearchCustomer('');
        setSearchProduct('');
        setStatusId('');
        setFilterDate('');
    };

    const handleUpdateForm = (e: React.FormEvent) => {
        e.preventDefault();
        const orderId = selectedOrderDate ? selectedOrderDate.id : null;
        // Enviamos la actualización al backend de Laravel
        patch(route('admin.orders.updateDelivery', orderId), {
            onSuccess: () => {
                setIsOpen(false);      // Cerramos el modal
                setSelectedOrderDate(null); // Limpiamos el pedido seleccionado
                // setLocalDate('');
                reset();                // Reseteamos el formulario
            }
        });
    };

    // useEffect(() => {
    //     if (cancelOrderId !== null) {
    //         // setCancelReason('');
    //         // setShowCancelReason(true);
    //         alert('hhhhhhhhhh----' + statusId + '---' + cancelOrderId);
    //     } else {
    //         // setShowCancelReason(false);
    //         //setCancelReason('');
    //     }
    // }, [cancelOrderId]);

    const handleStatusChange = (orderId, statusId) => {
        const newStatusId = parseInt(statusId);

        if (newStatusId === satatusCancelado) {
            alert('¡Atención! Vas a cambiar el estado a "Cancelado". Por favor, ingresa un motivo de cancelación antes de guardar.');
            setCancelOrderId(orderId);
            setCancelReason('');
            setShowCancelReason(true);
            setOldStatus(selectedOrder?.status || null); // Guardamos el estado anterior
            // alert('hhhhhhhhhh----' + newStatusId + '---' + cancelOrderId + '---' + orderId);
            // return;
        }

        if (cancelOrderId === orderId) {
            alert('Se ha cambiado el estado a otro diferente de "Cancelado". Se limpiará el motivo de cancelación.');
            setCancelOrderId(null);
            setCancelReason('');
            setShowCancelReason(false);
        }

        // Actualizar el estado local inmediatamente para UI responsivo
        if (selectedOrder?.id === orderId) {
            const newStatus = statuses.find((s) => s.id === newStatusId);
            setSelectedOrder({
                ...selectedOrder,
                order_status_id: newStatusId,
                status: newStatus,
            });
        }

        // Hacer el patch al servidor // cancelOrderId === orderId &&
        if (newStatusId !== satatusCancelado) {
            router.patch(route('admin.orders.updateStatus', orderId), {
                order_status_id: newStatusId,
            });
        }
    };

    const handleCancelReasonSave = () => {
        if (!cancelOrderId) {
            return;
        }

        patch(route('admin.orders.updateStatus', cancelOrderId), {
            order_status_id: satatusCancelado,
            cancel_reason: cancelReason,
        }, {
            preserveState: true,
            onSuccess: () => {
                setCancelOrderId(null);
                setCancelReason('');
                setShowCancelReason(false);
            },
        });
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Gestión de Pedidos" />

            <div className="py-12 px-4 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Panel de Producción</h1>


                {/* 🔍 SECCIÓN DE FILTROS NUEVA */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Filtros de Búsqueda</h2>
                        {(searchCustomer || searchProduct || statusId || filterDate) && (
                            <button
                                onClick={handleClearFilters}
                                className="text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Filtro Cliente */}
                        <div className="space-y-1">
                            <Label htmlFor="search_customer" className="text-xs font-medium text-gray-500">Cliente</Label>
                            <Input
                                id="search_customer"
                                placeholder="Buscar por cliente..."
                                value={searchCustomer}
                                onChange={(e) => setSearchCustomer(e.target.value)}
                                className="h-11 rounded-xl bg-gray-50 border-gray-200"
                            />
                        </div>

                        {/* Filtro Producto / Torta */}
                        <div className="space-y-1">
                            <Label htmlFor="search_product" className="text-xs font-medium text-gray-500">Torta / Producto</Label>
                            <Input
                                id="search_product"
                                placeholder="Ej: Torta Rogel..."
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                                className="h-11 rounded-xl bg-gray-50 border-gray-200"
                            />
                        </div>

                        {/* Filtro Estado */}
                        <div className="space-y-1">
                            <Label htmlFor="filter_status" className="text-xs font-medium text-gray-500">Estado</Label>
                            <select
                                id="filter_status"
                                value={statusId}
                                onChange={(e) => setStatusId(e.target.value)}
                                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 outline-none focus:border-pink-400 text-sm cursor-pointer"
                            >
                                <option value="">Todos los estados</option>
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Fecha de Entrega */}
                        <div className="space-y-1">
                            <Label htmlFor="filter_date" className="text-xs font-medium text-gray-500">Fecha de Entrega</Label>
                            <Input
                                id="filter_date"
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="h-11 rounded-xl bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                </div>


                <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Pedido</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha de Entrega</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {/* {orders.map((order) => ( */}
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{order.customer_name}</div>
                                        {/* Link directo a WhatsApp con mensaje predefinido */}
                                        <a
                                            href={`https://wa.me/54${order.customer_phone}?text=Hola%20${order.customer_name},%20soy%20Eliana%20de%20Pastelería%20Díaz...`}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 mt-1"
                                        >
                                            <MessageCircle size={16} fill="currentColor" className="text-green-500" />
                                            {order.customer_phone}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-mono font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded inline-block">
                                            {order.tracking_token}
                                        </div>
                                        <div className="text-sm font-black text-gray-900 mt-1">
                                            ${new Intl.NumberFormat('es-AR').format(order.total_amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <OrderStatusSelect
                                            orderId={order.id}
                                            currentStatusId={order.order_status_id}
                                            statuses={statuses}
                                            onStatusChange={handleStatusChange}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="">


                                            <button
                                                onClick={() => {
                                                    setSelectedOrderDate(order); // Guardamos el pedido actual (con su fecha/hora)
                                                    setIsOpen(true);          // ¡Abrimos el modal!
                                                }}
                                                className="h-12 inline-flex items-center gap-1 px-3 py-2 font-mono text-pink-500 bg-pink-50 hover:bg-pink-100 hover:text-pink-400 font-bold rounded-full cursor-pointer transition-all"
                                            >
                                                {order.delivery_date || '-'}
                                            </button>
                                        </div>


                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="h-12 inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full cursor-pointer transition-all"
                                        >
                                            <Eye size={14} /> Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>



                    {/* 🌟 COMPONENTE DE PAGINACIÓN */}
                    <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between sm:rounded-b-2xl">
                        <div className="text-sm text-gray-500">
                            Mostrando <span className="font-bold text-gray-700">{orders.data.length}</span> de <span className="font-bold text-gray-700">{orders.total}</span> pedidos
                        </div>

                        <div className="flex gap-1">
                            {orders.links.map((link, index) => {
                                // Laravel nos devuelve las etiquetas "Previous" y "Next" en inglés, las traducimos rápido
                                let label = link.label;

                                if (label.includes('Previous')) label = '« Ant.';

                                if (label.includes('Next')) label = 'Sig. »';

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        // Deshabilitamos el click si no hay URL válida (ej: estás en la pág 1 y querés ir a Anterior)
                                        as={link.url ? 'a' : 'span'}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                        className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${link.active
                                            ? 'bg-pink-500 text-white shadow-sm'
                                            : link.url
                                                ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer'
                                                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                            }`}
                                        // preserveState es vital para que si tiene filtros puestos, no se borren al pasar de página
                                        preserveState
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modificar Fecha y Hora</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateForm} className="space-y-4">
                        <div>
                            <Label htmlFor="date_part">Fecha de Entrega</Label>
                            <Input
                                id="date_part"
                                type="date"
                                // value={data.delivery_date} // Vinculado al estado de Inertia
                                // onChange={(e) => setData('delivery_date', e.target.value)} // Actualiza en tiempo real
                                value={data.date_part}
                                onChange={(e) => setData('date_part', e.target.value)}
                            />
                            {/* {errors.delivery_date && <p className="text-red-500 text-sm mt-1">{errors.delivery_date}</p>} */}
                            {errors.date_part && (
                                <p className="text-red-500 text-xs">{errors.date_part}</p>
                            )}
                        </div>

                        <TimePicker
                            value={data.time_part}
                            onChange={val => setData('time_part', val)} // Recibe "18:30" directo
                        />

                        {/* Checkbox para is_active aquí */}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing} // 👈 Evita clicks duplicados en la red
                        >
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {/* MODAL DE DETALLES */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Detalles del Pedido</h2>
                                <p className="text-xs font-mono text-pink-500">{selectedOrder.tracking_token}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">


                            <div className="mb-6">
                                {/* <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Torta Seleccionada</h3> */}
                                {selectedOrder.items?.map((item) => (
                                    <div key={item.id} className="bg-neutral-50 rounded-2xl p-4 border border-dashed border-gray-200 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-black text-lg">{item.product_name}</span>
                                            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border shadow-sm">x{item.quantity}</span>
                                        </div>


                                        {/* <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Estado del Pedido</h3> */}
                                        <OrderStatusSelect
                                            orderId={selectedOrder.id}
                                            currentStatusId={selectedOrder.order_status_id}
                                            statuses={statuses}
                                            onStatusChange={handleStatusChange}
                                        />
                                        <p>&nbsp;</p>

                                        {/* ------------------------------------------------------------- */}
                                        {showCancelReason && cancelOrderId && (
                                            <div className="bg-yellow-50 p-6 rounded-2xl mt-2 mb-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h2 className="text-sm font-bold text-amber-800">Motivo de cancelación</h2>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Seleccionaste cancelar el pedido <span className="font-semibold">{orders.data.find((order) => order.id === cancelOrderId)?.tracking_token || `#${cancelOrderId}`}</span>. Ingresa el motivo antes de guardar.
                                                        </p>
                                                    </div>
                                                </div>

                                                <textarea
                                                    value={cancelReason}
                                                    onChange={(e) => setCancelReason(e.target.value)}
                                                    placeholder="Describe por qué se canceló este pedido..."
                                                    className="w-full min-h-[120px] mt-4 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                                                />

                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelReasonSave}
                                                        disabled={!cancelReason.trim() || processing}
                                                        className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Guardar motivo de cancelación
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCancelOrderId(null);
                                                            setCancelReason('');
                                                            setShowCancelReason(false);
                                                            console.log('*************************', selectedOrder, oldStatus, cancelOrderId);
                                                            setSelectedOrder({
                                                                ...selectedOrder,
                                                                order_status_id: oldStatus?.id || selectedOrder.order_status_id,
                                                                status: oldStatus || selectedOrder.status,
                                                            });

                                                        }}
                                                        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                                                    >
                                                        No cambiar estado
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {/* ------------------------------------------------------------- */}


                                        {/* </div> */}

                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className="text-sm text-gray-700 font-medium">

                                                {item.product_image_at_purchase && (
                                                    // < img src={`${item.product_image_at_purchase}`} className="w-full h-20 object-cover rounded-lg mb-2" />
                                                    <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-inner">
                                                        <ImageZoom
                                                            src={`${item.product_image_at_purchase}`}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                <span className="block mt-2 text-xs text-gray-400 uppercase tracking-widest">${new Intl.NumberFormat('es-AR').format(item.price_at_purchase)} c/u</span>

                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mt-4">
                                                {/* Renderizado de selecciones ordenadas por paso */}
                                                {Object.entries(item.selections)
                                                    // 1. Convertimos a array y ordenamos por el step_number del primer elemento
                                                    .sort(([, a]: any, [, b]: any) => {
                                                        const stepA = a[0]?.attribute?.step_number || 99;
                                                        const stepB = b[0]?.attribute?.step_number || 99;
                                                        return stepA - stepB;
                                                    })
                                                    // 2. Mapeamos el array ya ordenado
                                                    .map(([key, value]: [string, any]) => (
                                                        <div key={key} className="text-sm">
                                                            <span className="text-gray-400 font-medium block text-[10px] uppercase">
                                                                {/* Mostramos el nombre del atributo (ej: Bizcochuelo) */}
                                                                {value[0]?.attribute?.name || key}
                                                            </span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {value.map((opt: any) => (
                                                                    <ImageModal
                                                                        key={opt.id}
                                                                        trigger={
                                                                            <span className="bg-white border px-2 py-0.5 rounded text-xs text-gray-700 cursor-pointer">
                                                                                {opt.name}
                                                                            </span>
                                                                        }
                                                                        imageSrc={`/${opt.image}`}
                                                                        imageAlt={opt.name}
                                                                        size="md"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 mb-2">
                                <h3 className="text-xs font-bold text-blue-400 uppercase mb-2">Notas</h3>
                                <span className="text-sm text-blue-900 leading-relaxed italic">
                                    <SafeHtml html={selectedOrder.notes || 'Sin notas adicionales'} className={'block'} />
                                </span>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-2xl border border-green-100">
                                <h3 className="text-xs font-bold text-amber-800 uppercase mb-2">Entrega
                                    {selectedOrder.delivery_date && (
                                        <>
                                            &nbsp;- {selectedOrder.delivery_date} hs
                                        </>
                                    )}


                                    {/* <p className="mt-2 text-xs text-gray-400 font-medium">Retiro de Producto:</p>
                                    {
                                        selectedOrder.is_delivery ? (
                                            <span className="block">Entrega a domicilio {selectedOrder.delivery_address}</span>
                                        ) : <span className="block">Retira en local</span>
                                    } */}
                                </h3>
                                <span className="text-sm text-green-900 leading-relaxed italic">
                                    {
                                        selectedOrder.is_delivery ? (
                                            <span className="block">Entrega a domicilio {selectedOrder.delivery_address}</span>
                                        ) : <span className="block">Retira en local</span>
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}