import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { RichTextEditor } from '@/components/rich-text-editor'; // 🌟 Tu componente Tiptap
import { ChevronsLeft, Save, Image as ImageIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { SectionTitle } from '../section-title';

export default function Create() {
    const breadcrumbs = [
        {
            module: 'Novedades',
            title: 'Nueva Publicación',
            description: 'Publicá sorteos, novedades o recetas con texto enriquecido para los clientes.',
            href: route('admin.posts.index'),
            action: 'create',
            btnAction: 'Volver al Listado'
        }
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        image: null as File | null,
        video: null as File | null, // 🌟 Nuevo
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Enviamos como FormData porque incluye la carga de un archivo de imagen
        post(route('admin.posts.store'), {
            forceFormData: true,
        });
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Nueva Publicación - Panel Admin" />

                <div className="p-8 bg-gray-50 min-h-screen space-y-6">
                    <SectionTitle lastBreadcrumb={breadcrumbs[0]} />
                    {/* Botón de volver */}
                    {/* <div className="flex items-center justify-between">
                        <Link
                            href={route('admin.posts.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={14} />
                            Volver al listado
                        </Link>
                    </div> */}

                    {/* Card del Formulario */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                        {/* <div className="mb-6">
                            <h2 className="text-xl font-black text-gray-900">Crear Nueva Publicación 📰</h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Publicá sorteos, novedades o recetas con texto enriquecido para los clientes.
                            </p>
                        </div> */}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 1. Título */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Título de la publicación</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="Ej: ¡Gran Sorteo por el Día del Padre! 🎁"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-100 transition-all"
                                />
                                {errors.title && <p className="text-xs font-bold text-red-500">{errors.title}</p>}
                            </div>

                            {/* 2. Imagen de Portada */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Imagen de Portada (Opcional)</label>
                                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div className="space-y-1 flex-grow">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                            className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white hover:file:bg-pink-500 file:transition-colors file:cursor-pointer cursor-pointer"
                                        />
                                        <p className="text-[10px] text-gray-400 font-medium">Formatos aceptados: JPG, PNG. Máximo 2MB.</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-xs font-bold text-red-500">{errors.image}</p>}
                            </div>
                            {/* // 2. Insertar este bloque JSX justo abajo del contenedor de "Imagen de Portada": */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Video Demostrativo del Pie (Opcional)</label>
                                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                    </div>
                                    <div className="space-y-1 flex-grow">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            onChange={e => setData('video', e.target.files ? e.target.files[0] : null)}
                                            className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white hover:file:bg-pink-500 file:transition-colors file:cursor-pointer cursor-pointer"
                                        />
                                        <p className="text-[10px] text-gray-400 font-medium">Formatos aceptados: MP4, WEBM. Máximo 20MB.</p>
                                    </div>
                                </div>
                                {errors.video && <p className="text-xs font-bold text-red-500">{errors.video}</p>}
                            </div>
                            {/* 3. Contenido Enriquecido (Tiptap) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Contenido</label>

                                {/* 🌟 Inyectamos tu RichTextEditor enganchando el HTML directamente al formulario */}
                                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:border-pink-500 transition-colors p-1">
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(html) => setData('content', html)}
                                    />
                                </div>
                                {errors.content && <p className="text-xs font-bold text-red-500">{errors.content}</p>}
                            </div>

                            {/* 4. Estado de visibilidad */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600 block">Estado Inicial</label>
                                <select
                                    value={data.is_active ? '1' : '0'}
                                    onChange={e => setData('is_active', e.target.value === '1')}
                                    className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-pink-500 transition-all bg-white cursor-pointer"
                                >
                                    <option value="1">🟢 Publicado (Visible en la web)</option>
                                    <option value="0">⚪ Borrador (Oculto por ahora)</option>
                                </select>
                            </div>

                            {/* Botón de envío */}
                            <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('admin.posts.index'))}
                                    className="h-11 px-6 bg-gray-500 hover:bg-gray-600 text-white text-xs font-black rounded-xl shadow-md shadow-pink-100 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    <ChevronsLeft size={14} />
                                    {processing ? 'Guardando...' : 'Cancelar'}
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 px-6 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black rounded-xl shadow-md shadow-pink-100 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    <Save size={14} />
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </AppLayout>
        </>
    );
}