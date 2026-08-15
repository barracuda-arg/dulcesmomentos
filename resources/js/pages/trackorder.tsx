import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star, Camera, Send, CheckCircle2, ChevronLeft, Info } from 'lucide-react';
import { Search, ShoppingBag, CheckCircle, Hammer, PackageCheck, Bike, PartyPopper, AlertTriangle } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';

export default function TrackOrder({ order, statuses, error, searchedToken, statusEntregado, statusCancelado }) {
    const { data, setData, post, processing } = useForm({
        token: searchedToken || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('order.track.form'),
            { token: data.token },
            { preserveState: true }
        );
    };

    // Mapeamos tus IDs de estado a íconos específicos para la pastelería
    const getStatusIcon = (statusId: number, isCurrent: boolean) => {
        const size = 22;
        const className = isCurrent ? "animate-pulse text-white" : "";

        switch (statusId) {
            case 1: return <ShoppingBag size={size} className={className} />; // Solicitado
            case 2: return <CheckCircle size={size} className={className} />;  // Confirmado
            case 3: return <Hammer size={size} className={className} />;       // En elaboración
            case 4: return <PackageCheck size={size} className={className} />; // Listo para entrega
            case 5: return <Bike size={size} className={`${className} ${isCurrent ? 'animate-bounce text-white' : ''}`} />; // En Distribución 🏍️
            case 6: return <PartyPopper size={size} className={className} />;  // Entregado 🎉
            default: return <ShoppingBag size={size} className={className} />;
        }
    };

    // Determinar la lógica de la ruta crítica
    const currentStatusId = order ? order.order_status_id : 0;
    const isCancelado = currentStatusId === statusCancelado;

    // Filtramos los estados "normales" (del 1 al 6) para armar la línea de tiempo base
    const normalStatuses = statuses.filter(s => s.id !== statusCancelado);
    const {
        data: feedbackData,
        setData: setFeedbackData,
        post: postFeedback,
        processing: feedbackProcessing,
        recentlySuccessful: feedbackSuccess
    } = useForm({
        rating: 0,
        comment: '',
        photo: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submitFeedback = (e: React.FormEvent) => {
        e.preventDefault();

        // 🛡️ Salvaguarda por si acaso, aunque la UI no debería mostrar el botón si es null
        if (!order) return;

        postFeedback(route('order.feedback.store', order.tracking_token), { // 🌟 Usando el alias
            forceFormData: true,
        });
    };
    console.log('Renderizando TrackOrder con order:', order);

    return (


        <MainLayout>
            <div className=" py-12 px-4 flex flex-col items-center justify-center">
                <Head title="Seguimiento de Pedido | Pastelería Díaz" />

                <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl bg-gradient-to-br from-pink-50 to-white border border-pasteleria-rosa">
                    {/* CABECERA */}
                    <div className="text-center space-y-2">
                        <span className="text-xs font-black uppercase tracking-widest text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                            Dulces Momentos
                        </span>
                        <h1 className="text-3xl font-black text-gray-800">¿Cómo viene mi Torta? 🎂</h1>
                        <p className="text-sm text-gray-500 mb-4">Ingresá el código alfanumérico de tu pedido para ver la hoja de ruta en tiempo real.</p>
                    </div>

                    {/* BUSCADOR */}
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Ej: DM-AB12-XY34"
                                value={data.token}
                                onChange={e => setData('token', e.target.value.toUpperCase())}
                                className="h-12 rounded-xl bg-gray-50 border-gray-200 pl-4 font-mono font-bold uppercase text-lg text-gray-700 tracking-wider placeholder:normal-case placeholder:font-normal placeholder:text-sm"
                                maxLength={20}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold h-12 rounded-xl px-6 flex items-center gap-2 cursor-pointer"
                        >
                            <Search size={18} />
                            {processing ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </form>

                    {/* MENSAJE DE ERROR */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-sm text-center font-medium max-w-md mx-auto">
                            {error}
                        </div>
                    )}

                    {/* DETALLES Y LÍNEA DE TIEMPO DEL PEDIDO */}
                    {order && (
                        <div className="space-y-10 pt-4 border-t border-dashed border-gray-100 animate-in fade-in zoom-in-95 duration-300">

                            {/* Resumen Superior */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-pasteleria-rosa">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cliente</p>
                                    <p className="text-base font-black text-gray-800">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Código de Seguimiento</p>
                                    <p className="text-base font-mono font-bold text-pink-500">{order.tracking_token}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tipo de Envío</p>
                                    <p className="text-base font-mono font-bold text-green-500">{order.is_delivery ? 'Entrega a domicilio' : 'Retira en local'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estado Actual</p>
                                    <span
                                        className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mt-0.5"
                                        style={{ backgroundColor: order.status?.color || '#6B7280' }}
                                    >
                                        {order.status?.name}
                                    </span>
                                </div>
                            </div>

                            {/* CASO ESPECIAL: PEDIDO CANCELADO */}
                            {isCancelado ? (
                                <div className="bg-red-50 border border-red-100 text-red-900 rounded-2xl p-6 flex flex-col items-center text-center space-y-2">
                                    <div className="p-3 bg-red-500 text-white rounded-full">
                                        <AlertTriangle size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-red-600">Este pedido fue Cancelado</h3>
                                    <p className="text-sm text-red-700 max-w-md">
                                        Lamentablemente este pedido fue dado de baja. Si tenés dudas o querés coordinar el reintegro de una seña, por favor comunicate con Eliana por WhatsApp.
                                    </p>
                                </div>
                            ) : (
                                /* LINEA DE TIEMPO FELIZ (Ruta Horizontal en Desktop / Vertical en Mobile) */
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Hoja de Ruta de tu Torta</h3>

                                    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 pt-6">

                                        {/* Barra Conectora Gris de Fondo (Solo Desktop) */}
                                        <div className="absolute top-[46px] left-[5%] right-[5%] h-1 bg-gray-100 -z-10 hidden md:block" />

                                        {/* Mapeo de la Ruta Crítica */}
                                        {normalStatuses.map((status, idx) => {
                                            // Un paso está completado si su ID es menor o igual al estado actual del pedido
                                            const isCompleted = status.id <= currentStatusId;
                                            const isCurrent = status.id === currentStatusId;

                                            return (
                                                <div key={status.id} className="flex flex-col items-center text-center w-full relative z-10">

                                                    {/* Círculo contenedor del ícono */}
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${isCurrent
                                                            ? 'scale-125 ring-4 ring-pink-100 shadow-md'
                                                            : isCompleted
                                                                ? 'opacity-100'
                                                                : 'bg-gray-100 text-gray-300 border-2 border-gray-200 opacity-40 blur-[0.4px]'
                                                            }`}
                                                        style={{
                                                            backgroundColor: isCompleted || isCurrent ? status.color : '',
                                                            color: isCompleted || isCurrent ? '#fff' : ''
                                                        }}
                                                    >
                                                        {getStatusIcon(status.id, isCurrent)}
                                                    </div>

                                                    {/* Textos del paso */}
                                                    <div className="mt-3 max-w-[120px] space-y-0.5">
                                                        <p className={`text-xs font-black leading-tight ${isCurrent
                                                            ? 'text-gray-900 font-black'
                                                            : isCompleted
                                                                ? 'text-gray-700'
                                                                : 'text-gray-300'
                                                            }`}>
                                                            {status.name.split(' (')[0]} {/* Limpia el "(Pago parcial)" para que no sature la UI */}
                                                        </p>
                                                        {isCurrent && (
                                                            <span className="inline-block text-[9px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                                                                Actual
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Línea conectora vertical (Solo Mobile, conecta este nodo con el siguiente) */}
                                                    {idx < normalStatuses.length - 1 && (
                                                        <div className={`w-0.5 h-8 md:hidden mt-2 ${status.id < currentStatusId ? 'bg-pink-500' : 'bg-gray-200'
                                                            }`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}



                            {order && order.order_status_id === statusEntregado && (
                                <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {!order.feedback && !feedbackSuccess ? (
                                        <form onSubmit={submitFeedback} className="bg-white rounded-3xl shadow-2xl border-4 border-pink-100 p-8 max-w-lg mx-auto space-y-6">
                                            <div className="text-center space-y-2">
                                                <div className="inline-block p-3 bg-pink-50 rounded-full text-pink-500 mb-2">
                                                    <Star size={32} fill="currentColor" />
                                                </div>
                                                <h2 className="text-2xl font-black text-gray-800">Califica nuestro servicio</h2>
                                                <p className="text-sm text-gray-500">Tu opinión es el ingrediente más importante para nosotros.</p>
                                            </div>

                                            {/* Estrellas */}
                                            <div className="flex justify-center gap-2">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setFeedbackData('rating', num)}
                                                        className={`transition-all duration-200 transform hover:scale-125 ${feedbackData.rating >= num ? 'text-yellow-400' : 'text-gray-200'
                                                            }`}
                                                    >
                                                        <Star size={40} fill={feedbackData.rating >= num ? "currentColor" : "none"} strokeWidth={2} />
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Comentario */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tu experiencia</label>
                                                <textarea
                                                    value={feedbackData.comment}
                                                    onChange={e => setFeedbackData('comment', e.target.value)}
                                                    placeholder="Contanos qué tal estaba el sabor, la decoración..."
                                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-pink-200 focus:outline-none min-h-[100px] resize-none"
                                                />
                                            </div>

                                            {/* Foto (Opcional) */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Subir una foto (opcional)</label>
                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors text-gray-500">
                                                        <Camera size={24} />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={e => {
                                                                const file = e.target.files?.[0] || null;
                                                                setFeedbackData('photo', file);
                                                                if (file) setPreview(URL.createObjectURL(file));
                                                            }}
                                                        />
                                                    </label>
                                                    {preview && (
                                                        <img src={preview} className="w-14 h-14 object-cover rounded-xl border-2 border-pink-200" alt="Preview" />
                                                    )}
                                                    <p className="text-[10px] text-gray-400 leading-tight">
                                                        ¡Mostrale al mundo cómo quedó tu torta en la mesa!
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Aviso Legal de Social Proof */}
                                            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 border border-blue-100">
                                                <div className="text-blue-500 shrink-0 mt-1">
                                                    <Info size={16} />
                                                </div>
                                                <p className="text-[10px] text-blue-700 leading-normal">
                                                    Al enviar este comentario, autorizas a <strong>Dulces Momentos</strong> a publicar tu nombre y reseña en nuestra página principal. Valoramos tu privacidad y solo usaremos esto para mostrar nuestro trabajo.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={feedbackProcessing || feedbackData.rating === 0}
                                                className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                                            >
                                                <Send size={18} />
                                                {feedbackProcessing ? 'Enviando...' : 'Publicar Reseña'}
                                            </button>
                                        </form>
                                    ) : (
                                        /* Mensaje de agradecimiento después del envío */
                                        <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto animate-in zoom-in-95">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mx-auto shadow-lg">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <h2 className="text-2xl font-black text-green-800">¡Muchas gracias por tu Opinión!</h2>
                                            <p className="text-green-700 text-sm">
                                                Tu reseña fue recibida con éxito. Eliana la revisará pronto para compartirla con toda la comunidad. ✨
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Detalles de los productos solicitados */}
                            <div className="border-t border-gray-100 pt-6 space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tu Detalle:</h4>
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm bg-neutral-50 px-4 py-3 rounded-xl border border-gray-100">
                                        <span className="font-bold text-gray-800">{item.product_name} <span className="text-xs text-gray-400 font-medium">x{item.quantity}</span></span>
                                        <span className="font-mono text-xs text-gray-400">Entrega programada: {order.delivery_date ? order.delivery_date.substring(0, 16) : '-'} hs</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}