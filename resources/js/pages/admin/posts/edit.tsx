import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { RichTextEditor } from '@/components/rich-text-editor';
import { ChevronsLeft, Save, Image as ImageIcon, Video } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { SectionTitle } from '../section-title';

interface PostData {
    id: number;
    title: string;
    content: string;
    is_active: boolean;
    image_url: string | null;
    video_url: string | null;
}

interface Props {
    post: PostData;
}

export default function Edit({ post: existingPost }: Props) {

    const breadcrumbs = [
        {
            module: 'Novedades',
            title: 'Editar Publicación',
            description: 'Modificá los textos, reordená las imágenes inline o actualizá el material multimedia.',
            href: route('admin.posts.index'),
            action: 'edit',
            btnAction: 'Volver al Listado'
        }
    ];


    // Inicializamos el formulario con los datos que nos manda Laravel
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // 🌟 Importante: Para simular PUT en un envío FormData con archivos
        title: existingPost.title,
        content: existingPost.content,
        image: null as File | null,
        video: null as File | null,
        is_active: existingPost.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Enviamos mediante POST pero con _method: 'PUT' porque el navegador no soporta
        // subida de archivos binarios nativos directamente en verbos PUT/PATCH tradicionales
        post(route('admin.posts.update', existingPost.id), {
            forceFormData: true,
        });
    };

    return (
        <>
            {/* <Head title={`Editar "${existingPost.title}" - Panel Admin`} />

            <div className="p-8 bg-gray-50 min-h-screen max-w-4xl mx-auto space-y-6">

                /////// Botón de volver
                <div className="flex items-center justify-between">
                    <Link
                        href={route('admin.posts.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                        Volver al listado
                    </Link>
                </div> */}
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Editar "${existingPost.title}" - Panel Admin`} />

                <div className="p-8 bg-gray-50 min-h-screen space-y-6">
                    <SectionTitle lastBreadcrumb={breadcrumbs[0]} />

                    {/* Card del Formulario */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                        {/* <div className="mb-6">
                            <h2 className="text-xl font-black text-gray-900">Editar Publicación 📝</h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Modificá los textos, reordená las imágenes inline o actualizá el material multimedia.
                            </p>
                        </div> */}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Título</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-pink-500 transition-all"
                                />
                                {errors.title && <p className="text-xs font-bold text-red-500">{errors.title}</p>}
                            </div>

                            {/* Imagen de Portada */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Imagen de Portada</label>

                                {/* Vista previa si ya existe una */}
                                {existingPost.image_url && !data.image && (
                                    <div className="mb-2 relative w-32 h-20 rounded-xl overflow-hidden border border-gray-100">
                                        <img src={existingPost.image_url} alt="Actual" className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 right-1 bg-black/60 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">Actual</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl"><ImageIcon size={20} /></div>
                                    <div className="space-y-1 flex-grow">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                            className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white hover:file:bg-pink-500 format-btn cursor-pointer"
                                        />
                                        <p className="text-[10px] text-gray-400">Seleccioná un archivo solo si querés reemplazar la portada actual.</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-xs font-bold text-red-500">{errors.image}</p>}
                            </div>

                            {/* Video Demostrativo del Pie */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Video del Pie</label>

                                {/* Muestra si ya hay un video cargado */}
                                {existingPost.video_url && !data.video && (
                                    <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-100 w-fit">
                                        <Video size={14} className="text-pink-500" /> ¡Ya tenés un video cargado para esta novedad!
                                    </div>
                                )}

                                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                    </div>
                                    <div className="space-y-1 flex-grow">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            onChange={e => setData('video', e.target.files ? e.target.files[0] : null)}
                                            className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white hover:file:bg-pink-500 format-btn cursor-pointer"
                                        />
                                        <p className="text-[10px] text-gray-400">Subí un archivo nuevo si querés reemplazar o agregar el video.</p>
                                    </div>
                                </div>
                                {errors.video && <p className="text-xs font-bold text-red-500">{errors.video}</p>}
                            </div>

                            {/* Contenido (Tiptap) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Contenido</label>
                                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:border-pink-500 p-1">
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(html) => setData('content', html)}
                                    />
                                </div>
                                {errors.content && <p className="text-xs font-bold text-red-500">{errors.content}</p>}
                            </div>

                            {/* Estado */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-600">Estado</label>
                                <select
                                    value={data.is_active ? '1' : '0'}
                                    onChange={e => setData('is_active', e.target.value === '1')}
                                    className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-pink-500 bg-white cursor-pointer"
                                >
                                    <option value="1">🟢 Publicado (Visible)</option>
                                    <option value="0">⚪ Borrador (Oculto)</option>
                                </select>
                            </div>

                            {/* Botón guardar */}
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
                                    {processing ? 'Actualizando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
//                 </div>
//             </>
//             );
// }