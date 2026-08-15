import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Search, Eye, RefreshCw, Star, Check, X, ExternalLink, Camera, Trash2, Calendar } from 'lucide-react';
import { ImageZoom } from "../../zoom";
import Pagination from '@/components/pagination'; // 🌟 Importamos tu nuevo juguete
import { BreadcrumbItem } from '@/types/navigation';
import { SectionTitle } from '../section-title';
// 🌟 Importamos tus componentes estándar de Shadcn
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";


export default function FeedbacksIndex({ feedbacksPaginated = [], auth, filters }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            module: 'Comentarios de Clientes',
            title: 'Moderación de Reseñas 💬',
            href: '',
            action: 'list',
            btnAction: '+ Agregar Reseña Manual',
        },
    ];
    // Estados locales para los filtros, pre-cargados con lo que ya venga en la URL
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [status, setStatus] = useState(filters.status || '');



    // 🌟 Estado exclusivo para poder cerrar el Dialog desde el código tras un envío exitoso DIALOG HARDCODED
    // const [open, setOpen] = useState(false);
    // Estado para controlar el cierre automático del dialog de Shadcn
    const [openManualModal, setOpenManualModal] = useState(false);







    // 1. Empieza a declarar los componentes del MODAL de agregar manual
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // 2. Formulario independiente para CREAR el feedback manual
    const {
        data: manualData,
        setData: setManualData,
        post: postManual,
        processing: manualProcessing,
        errors: manualErrors,
        reset: resetManual
    } = useForm({
        customer_name: '', // Nombre del cliente (ya que no viene de un pedido automático)
        rating: 5,         // Por defecto 5 estrellas
        comment: '',
        photo: null as File | null,
    });
    // Estado local para la previsualización de la foto en el modal
    const [manualPreview, setManualPreview] = useState<string | null>(null);


    // 3. Manejador del envío del formulario manual
    const handleSubmitManual = (e: React.FormEvent) => {
        e.preventDefault();

        postManual(route('admin.feedbacks.store-manual'), {
            forceFormData: true, // Necesario porque incluimos una foto binaria
            onSuccess: () => {
                setOpenManualModal(false); // Cerramos el modal
                resetManual();          // Limpiamos los campos
                setManualPreview(null); // Quitamos la preview de la foto
            }
        });
    };


    // Función que unifica y ejecuta la búsqueda mandando la data a Laravel
    const applyFilters = () => {
        router.get(
            route('admin.feedbacks.index'), // Tu ruta de la grilla
            { search, date, status },
            {
                preserveState: true, // 🌟 Clave: Evita que se limpie lo que Eliana está escribiendo
                replace: true        // Reemplaza el historial de navegación para no acumular basura al tipear
            }
        );
    };
    // Auto-aplicar filtros cuando cambie el Estado (Visibilidad) o la Fecha
    useEffect(() => {
        applyFilters();
    }, [date, status]);


    // Función para limpiar los filtros de un solo tiro
    const handleReset = () => {
        setSearch('');
        setDate('');
        setStatus('');
        router.get(route('admin.feedbacks.index'));
    };

    // Como ahora está paginado, los registros reales viven dentro de feedbacks.data
    const feedbacks = feedbacksPaginated.data;
    console.log('**********', feedbacksPaginated);

    // Función para prender/apagar la aprobación
    const handleToggleApproval = (id: number) => {
        router.patch(route('admin.feedbacks.toggle', id), {}, {
            preserveScroll: true // Evita que la pantalla salte arriba al actualizar
        });
    };

    // Función para capturar el cambio de archivo y subirlo al instante
    const handlePhotoChange = (id: number, file: File | null) => {
        if (!file) return;

        // Mandamos como FormData porque incluye un archivo binario
        router.post(route('admin.feedbacks.photo', id), {
            _method: 'POST',
            photo: file
        }, {
            forceFormData: true,
            preserveScroll: true
        });
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Reseñas de Clientes" />
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div>
                        <SectionTitle
                            lastBreadcrumb={{ title: 'Moderación de Reseñas', url: '' }}
                            actionType="modal"
                            dialogOpen={openManualModal}
                            onDialogOpenChange={setOpenManualModal}
                            // Metemos el cuerpo del modal acá adentro
                            dialogContent={
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-black text-gray-800">
                                            Cargar Reseña de WhatsApp 📱
                                        </DialogTitle>
                                    </DialogHeader>

                                    {/* // Formulario Interno */}
                                    <form onSubmit={handleSubmitManual} className="space-y-4 mt-2">

                                        {/* // Campo: Nombre del Cliente */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Nombre del Cliente</label>
                                            <input
                                                type="text"
                                                required
                                                value={manualData.customer_name}
                                                onChange={e => setManualData('customer_name', e.target.value)}
                                                placeholder="Ej: María Luz (WhatsApp)"
                                                className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors"
                                            />
                                            {manualErrors.customer_name && <p className="text-red-500 text-[11px] font-bold">{manualErrors.customer_name}</p>}
                                        </div>

                                        {/* // Campo: Estrellas */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Calificación</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setManualData('rating', star)}
                                                        className="text-2xl focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                                    >
                                                        <span className={star <= manualData.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* // Campo: Comentario */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Comentario del Cliente</label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={manualData.comment}
                                                onChange={e => setManualData('comment', e.target.value)}
                                                placeholder="Pegá acá el lindo mensaje que te mandaron..."
                                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors resize-none"
                                            />
                                            {manualErrors.comment && <p className="text-red-500 text-[11px] font-bold">{manualErrors.comment}</p>}
                                        </div>

                                        {/* // Campo: Foto Opcional */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Foto del Producto (Opcional)</label>
                                            <div className="flex items-center gap-3">
                                                <label className="h-10 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                                                    <Camera size={14} />
                                                    Elegir Foto
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={e => {
                                                            const file = e.target.files?.[0] || null;
                                                            setManualData('photo', file);

                                                            if (file) {
                                                                setManualPreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                {manualPreview && (
                                                    <img src={manualPreview} className="w-10 h-10 object-cover rounded-xl border border-gray-200 shadow-sm" alt="Preview" />
                                                )}
                                            </div>
                                            {manualErrors.photo && <p className="text-red-500 text-[11px] font-bold">{manualErrors.photo}</p>}
                                        </div>

                                        {/* // Botón de Envío */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={manualProcessing}
                                                className="w-full h-11 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                                            >
                                                {manualProcessing ? 'Guardando...' : 'Publicar Reseña Manual'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            }
                        />
                        {/* <SectionTitle
                            lastBreadcrumb={breadcrumbs[breadcrumbs.length - 1]}
                            actionType="modal"
                            onAddItem={() => setIsDialogOpen(true)}
                            />

                        <p className="text-sm text-gray-500">Aprobá los comentarios y gestioná las fotos que se lucirán en la Home Page.</p> */}

                        {/* 🌟 INTEGRACIÓN DEL DIALOG DE SHADCN */}
                        {/* <Dialog open={open} onOpenChange={setOpen}>

                            // El Trigger envuelve a tu botón rosa original
                            <DialogTrigger asChild>
                                <button className="h-10 px-4 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
                                    <Plus size={16} strokeWidth={3} />
                                    Agregar Reseña Manual
                                </button>
                            </DialogTrigger>

                            // </div></div>Contenido del Modal (Shadcn se encarga del fondo oscuro y las animaciones)
                            <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white">

                                <DialogHeader>
                                    <DialogTitle className="text-lg font-black text-gray-800">
                                        Cargar Reseña de WhatsApp 📱
                                    </DialogTitle>
                                </DialogHeader>

                                // Formulario Interno
                                <form onSubmit={handleSubmitManual} className="space-y-4 mt-2">

                                    // Campo: Nombre del Cliente
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Nombre del Cliente</label>
                                        <input
                                            type="text"
                                            required
                                            value={manualData.customer_name}
                                            onChange={e => setManualData('customer_name', e.target.value)}
                                            placeholder="Ej: María Luz (WhatsApp)"
                                            className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors"
                                        />
                                        {manualErrors.customer_name && <p className="text-red-500 text-[11px] font-bold">{manualErrors.customer_name}</p>}
                                    </div>

                                    // Campo: Estrellas
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Calificación</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setManualData('rating', star)}
                                                    className="text-2xl focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                                >
                                                    <span className={star <= manualData.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    // Campo: Comentario
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Comentario del Cliente</label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={manualData.comment}
                                            onChange={e => setManualData('comment', e.target.value)}
                                            placeholder="Pegá acá el lindo mensaje que te mandaron..."
                                            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors resize-none"
                                        />
                                        {manualErrors.comment && <p className="text-red-500 text-[11px] font-bold">{manualErrors.comment}</p>}
                                    </div>

                                    // Campo: Foto Opcional
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Foto del Producto (Opcional)</label>
                                        <div className="flex items-center gap-3">
                                            <label className="h-10 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                                                <Camera size={14} />
                                                Elegir Foto
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0] || null;
                                                        setManualData('photo', file);
                                                        if (file) {
                                                            setManualPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                            </label>
                                            {manualPreview && (
                                                <img src={manualPreview} className="w-10 h-10 object-cover rounded-xl border border-gray-200 shadow-sm" alt="Preview" />
                                            )}
                                        </div>
                                        {manualErrors.photo && <p className="text-red-500 text-[11px] font-bold">{manualErrors.photo}</p>}
                                    </div>

                                    // Botón de Envío
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={manualProcessing}
                                            className="w-full h-11 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                                        >
                                            {manualProcessing ? 'Guardando...' : 'Publicar Reseña Manual'}
                                        </button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog> */}



                    </div>
                    {/* 🌟 BARRA DE FILTROS ULTRA ESTÉTICA */}
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3">

                        {/* Filtro 1: Buscador de Texto */}
                        <div className="relative w-full md:flex-1">
                            <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()} // Aplica al meter un Enter
                                placeholder="Buscar por cliente o comentario..."
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        {/* Filtro 2: Selector de Fecha */}
                        <div className="relative w-full md:w-44">
                            <Calendar className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" size={16} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-10 pl-10 pr-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        {/* Filtro 3: Estado de Visibilidad */}
                        <div className="relative w-full md:w-44">
                            <Eye className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" size={16} />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-10 pl-10 pr-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-black text-gray-600 focus:outline-none focus:border-pink-500 appearance-none transition-colors"
                            >
                                <option value="">Todos los estados</option>
                                <option value="visibles">🟢 Visibles</option>
                                <option value="ocultos">⚫ Ocultos</option>
                            </select>
                        </div>

                        {/* Botones de acción rápida */}
                        <div className="flex gap-2 w-full md:w-auto shrink-0">
                            <button
                                onClick={applyFilters}
                                className="flex-1 md:flex-none h-10 px-5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-black rounded-xl shadow-sm transition-colors cursor-pointer"
                            >
                                {/* Buscar */}
                                <Search size={14} className="mr-1" />
                            </button>
                            {(search || date || status) && (
                                <button
                                    onClick={handleReset}
                                    title="Limpiar filtros"
                                    className="h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                                    <th className="p-4">Cliente / Pedido</th>
                                    <th className="p-4">Calificación</th>
                                    <th className="p-4 w-1/3">Comentario</th>
                                    <th className="p-4 text-center">Foto Representativa</th>
                                    <th className="p-4 text-center">Visibilidad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
                                {feedbacks.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">No se recibieron reseñas todavía.</td>
                                    </tr>
                                ) : (
                                    feedbacks.map((fb) => (
                                        <tr key={fb.id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* Cliente y Código */}
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">{fb.client}</div>
                                                <div className="text-[11px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                                                    <span>Token: {fb.token}</span>
                                                    <a href={route('order.track.form', { token: fb.token })} target="_blank" className="hover:text-pink-500">
                                                        <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            </td>

                                            {/* Estrellas */}
                                            <td className="p-4">
                                                <div className="flex text-yellow-400">
                                                    {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold">{fb.created_at}</span>
                                            </td>

                                            {/* Comentario */}
                                            <td className="p-4 italic text-gray-500 text-xs bg-gray-50/30">
                                                {fb.comment ? `"${fb.comment}"` : <span className="text-gray-300">Sin comentario escrito</span>}
                                            </td>

                                            {/* Foto Dinámica e Input oculto */}
                                            <td className="p-4">
                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                    {fb.photo_url ? (
                                                        /* 🌟 Contenedor relativo con grupo para el efecto Hover */
                                                        <div className="relative group w-12 h-12">
                                                            {/* <img
                                                                src={fb.photo_url}
                                                                className="w-12 h-12 object-cover rounded-xl border border-gray-200 shadow-sm transition-opacity group-hover:opacity-70"
                                                                alt="Producto"
                                                            /> */}

                                                            <ImageZoom
                                                                src={fb.photo_url}
                                                                alt="Foto de la reseña"
                                                                className="w-full h-full object-cover cursor-pointer"
                                                            />

                                                            {/* 🗑️ Botón flotante para eliminar la foto */}
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('¿Estás segura de que querés quitar la foto de esta reseña?')) {
                                                                        router.delete(route('admin.feedbacks.remove-photo', fb.id), {
                                                                            preserveScroll: true
                                                                        });
                                                                    }
                                                                }}
                                                                title="Quitar foto"
                                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                            >
                                                                <Trash2 size={10} strokeWidth={3} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        /* Si no hay foto, se muestra el estado vacío estético */
                                                        <div className="w-12 h-12 bg-amber-50 border border-amber-100 border-dashed rounded-xl flex items-center justify-center text-amber-600 text-[10px] font-black uppercase text-center p-1 leading-tight">
                                                            Sin Foto
                                                        </div>
                                                    )}

                                                    {/* Input de "Cambiar / Subir" (Sigue funcionando exactamente igual) */}
                                                    <label className="text-[10px] font-black text-pink-500 bg-pink-50 px-2 py-1 rounded-md cursor-pointer hover:bg-pink-100 transition-colors flex items-center gap-1">
                                                        <Camera size={10} />
                                                        {fb.photo_url ? 'Cambiar' : 'Subir'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handlePhotoChange(fb.id, e.target.files?.[0] || null)}
                                                        />
                                                    </label>
                                                </div>
                                            </td>

                                            {/* Switch / Toggle de Aprobación */}
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleToggleApproval(fb.id)}
                                                    className={`mx-auto w-24 h-9 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black tracking-wide transition-all shadow-sm cursor-pointer ${fb.is_approved
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {fb.is_approved ? (
                                                        <>
                                                            <Check size={14} strokeWidth={3} /> Visible
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X size={14} strokeWidth={3} /> Oculto
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {/* 🌟 LA MAGIA DE UNA SOLA ETIQUETA ACÁ: */}
                        <Pagination links={feedbacksPaginated.links} />
                    </div>
                </div>
            </div>
            {/* 🌟 COMPONENTE DIALOG / MODAL (Estructura Accesible) */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Fondo oscuro detrás del modal */}
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        onClick={() => setIsDialogOpen(false)}
                    />

                    {/* Contenedor del Modal */}
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 space-y-4 animate-in zoom-in-95 duration-200">

                        {/* Título y botón cerrar */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-gray-800">Cargar Reseña de WhatsApp 📱</h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmitManual} className="space-y-4">

                            {/* Campo: Nombre del Cliente */}
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    required
                                    value={manualData.customer_name}
                                    onChange={e => setManualData('customer_name', e.target.value)}
                                    placeholder="Ej: María Luz (WhatsApp)"
                                    className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors"
                                />
                                {manualErrors.customer_name && <p className="text-red-500 text-[11px] font-bold">{manualErrors.customer_name}</p>}
                            </div>

                            {/* Campo: Estrellas Interactivas */}
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Calificación</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setManualData('rating', star)}
                                            className="text-2xl focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                        >
                                            <span className={star <= manualData.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Campo: Comentario Copiado */}
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Comentario del Cliente</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={manualData.comment}
                                    onChange={e => setManualData('comment', e.target.value)}
                                    placeholder="Pegá acá el lindo mensaje que te mandaron..."
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 transition-colors resize-none"
                                />
                                {manualErrors.comment && <p className="text-red-500 text-[11px] font-bold">{manualErrors.comment}</p>}
                            </div>

                            {/* Campo: Foto Opcional del Producto */}
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Foto del Producto (Opcional)</label>
                                <div className="flex items-center gap-3">
                                    <label className="h-10 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                                        <Camera size={14} />
                                        Elegir Foto
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null;
                                                setManualData('photo', file);
                                                if (file) {
                                                    setManualPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                    </label>
                                    {manualPreview && (
                                        <img src={manualPreview} className="w-10 h-10 object-cover rounded-xl border border-gray-200 shadow-sm" alt="Preview" />
                                    )}
                                </div>
                                {manualErrors.photo && <p className="text-red-500 text-[11px] font-bold">{manualErrors.photo}</p>}
                            </div>

                            {/* Botón de envío */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={manualProcessing}
                                    className="w-full h-11 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                                >
                                    {manualProcessing ? 'Guardando...' : 'Publicar Reseña Manual'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}