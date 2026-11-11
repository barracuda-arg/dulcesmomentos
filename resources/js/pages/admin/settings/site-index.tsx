import React, { useState } from 'react';
import { router, Head, useForm } from '@inertiajs/react';
// import AdminLayout from '@/layouts/admin-layout'; // Tu layout de administración
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, LayoutTemplate, Store, Image as ImageIcon, Globe, Images, Plus, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner'; // O el sistema de alertas que uses
import { getImagePath } from '@/utils/formatters';


import AppLayout from '@/layouts/app-layout';
import { SectionTitle } from '../section-title';

// Cambiá este import por la ruta real de tu editor enriquecido de Novedades
import { RichTextEditor } from '@/components/rich-text-editor';

interface Section {
    id: number;
    slug: string;
    title: string;
    description: string;
    content: string | null;
    image_url: string | null;
}

interface Slide {
    id: number;
    title: string | null;
    image_url: string;
    order: number;
}

interface Props {
    sections: Section[];
    settings: {
        site_name: string;
        contact_email: string;
        whatsapp_number: string;
        business_address: string;
        latitude: string;
        longitude: string;
        instagram_profile: string;
        facebook_profile: string;
        texto_pie_de_pagina: string;
    };
    slides: Slide[];
}

export default function SiteIndex({ sections, settings, slides }: Props) {

    const breadcrumbs = [
        {
            module: 'Configuración del Sitio',
            title: 'Administrar Contenidos y Variables Globales',
            description: 'Configura los contenidos y variables globales del sitio.',
            href: route('admin.settings.index'),
            action: 'create',
            btnAction: ''
        }
    ];
    // 1. Formulario para las Configuraciones Generales
    const generalForm = useForm({
        site_name: settings.site_name || '',
        contact_email: settings.contact_email || '',
        whatsapp_number: settings.whatsapp_number || '',
        business_address: settings.business_address || '',
        latitude: settings.latitude || '',
        longitude: settings.longitude || '',
        instagram_profile: settings.instagram_profile || '',
        facebook_profile: settings.facebook_profile || '',
        texto_pie_de_pagina: settings.texto_pie_de_pagina || '',
    });

    // 2. Estado para saber qué sección pública se está editando actualmente
    const [selectedSection, setSelectedSection] = useState<Section>(sections[0]);
    // const [sectionPreview, setSectionPreview] = useState<string | null>(selectedSection.image_url);
    const [sectionPreview, setSectionPreview] = useState<string | null>(getImagePath(selectedSection.image_url));

    // 3. Formulario para la Sección seleccionada
    const sectionForm = useForm({
        _method: 'POST', // Usamos POST nativo para transporte de imágenes
        title: selectedSection.title,
        description: selectedSection.description || '',
        content: selectedSection.content || '',
        image: null as File | null,
    });

    // Cambiar de sección activa en el selector
    const handleSectionChange = (slug: string) => {
        const section = sections.find(s => s.slug === slug);
        if (section) {
            setSelectedSection(section);
            // setSectionPreview(section.image_url);
            setSectionPreview(getImagePath(section.image_url));
            sectionForm.setData({
                _method: 'POST',
                title: section.title,
                description: section.description || '',
                content: section.content || '',
                image: null,
            });
        }
    };

    // Guardar Datos Generales del Negocio
    const submitGeneralSettings = (e: React.FormEvent) => {
        e.preventDefault();
        generalForm.post(route('admin.settings.generales.update'), {
            onSuccess: () => toast.success('Configuraciones generales guardadas.'),
        });
    };

    // Guardar la Sección de Página
    const submitSectionSettings = (e: React.FormEvent) => {
        e.preventDefault();
        sectionForm.post(route('admin.settings.sections.update', selectedSection.id), {
            forceFormData: true,
            onSuccess: () => toast.success(`Sección ${selectedSection.title} actualizada con éxito.`),
        });
    };
    // Formulario para agregar una nueva imagen al slider
    const newSlideForm = useForm({
        title: '',
        image: null as File | null,
    });

    const submitNewSlide = (e: React.FormEvent) => {
        e.preventDefault();
        newSlideForm.post(route('admin.settings.slider.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Imagen agregada al slider.');
                newSlideForm.reset();
            },
        });
    };

    const deleteSlide = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta imagen del slider?')) {
            router.delete(route('admin.settings.slider.destroy', id), {
                onSuccess: () => toast.success('Imagen eliminada.'),
            });
        }
    };

    const resetSlider = () => {
        if (confirm('¿Restaurar las imágenes por defecto del slider? Se borrarán las actuales.')) {
            router.post(route('admin.settings.slider.reset'), {
                onSuccess: () => toast.success('Slider restaurado por defecto.'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Publicación - Panel Admin" />

            <div className="p-8 bg-gray-50 min-h-screen space-y-6">
                <SectionTitle lastBreadcrumb={breadcrumbs[0]} />




                <div className="space-y-6 p-6 max-w-6xl mx-auto">
                    {/* <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Personalización y Ajustes</h1>
                        <p className="text-sm text-gray-500">Modificá los textos de las páginas principales y la información del negocio.</p>
                    </div> */}

                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-md">
                            <TabsTrigger value="general" className="flex items-center gap-2">
                                <Store size={16} /> Datos del Negocio
                            </TabsTrigger>
                            <TabsTrigger value="sections" className="flex items-center gap-2">
                                <LayoutTemplate size={16} /> Secciones del Sitio
                            </TabsTrigger>
                            <TabsTrigger value="slider" className="flex items-center gap-2">
                                <Images size={16} /> Slider Hero
                            </TabsTrigger>
                        </TabsList>

                        {/* --- PESTAÑA: CONFIGURACIÓN GENERAL --- */}
                        <TabsContent value="general" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-bold">Información General</CardTitle>
                                    <CardDescription>Datos clave que se usan para los enlaces de WhatsApp, correos y mapas del sitio.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submitGeneralSettings} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nombre de la Página</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.site_name}
                                                    onChange={e => generalForm.setData('site_name', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email de Recepción (Contacto)</label>
                                                <input
                                                    type="email"
                                                    value={generalForm.data.contact_email}
                                                    onChange={e => generalForm.setData('contact_email', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Instagram de la Página</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.instagram_profile}
                                                    onChange={e => generalForm.setData('instagram_profile', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>


                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">WhatsApp de Notificaciones</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.whatsapp_number}
                                                    onChange={e => generalForm.setData('whatsapp_number', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Facebook de la Página</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.facebook_profile}
                                                    onChange={e => generalForm.setData('facebook_profile', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />

                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Dirección Física del Negocio</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.business_address}
                                                    onChange={e => generalForm.setData('business_address', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Latitud (Google Maps)</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.latitude}
                                                    onChange={e => generalForm.setData('latitude', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Longitud (Google Maps)</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.longitude}
                                                    onChange={e => generalForm.setData('longitude', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Texto Pie de Página</label>
                                                <input
                                                    type="text"
                                                    value={generalForm.data.texto_pie_de_pagina}
                                                    onChange={e => generalForm.setData('texto_pie_de_pagina', e.target.value)}
                                                    className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={generalForm.processing}
                                                className="h-10 bg-pink-500 hover:bg-pink-600 text-white px-5 text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                                            >
                                                <Save size={16} /> Guardar Ajustes del Negocio
                                            </button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* --- PESTAÑA: SECCIONES PÚBLICAS (CMS) --- */}
                        <TabsContent value="sections" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                {/* Selector Izquierdo de Páginas */}
                                <div className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-3 space-y-1">
                                    <span className="text-[10px] font-black uppercase text-gray-400 px-3 tracking-wider">Elegir Sección</span>
                                    {sections.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleSectionChange(s.slug)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${selectedSection.slug === s.slug
                                                ? 'bg-pink-50 text-pink-600 font-bold'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Globe size={14} />
                                            {s.slug === 'catalogo' && 'Catálogo'}
                                            {s.slug === 'novedades' && 'Novedades'}
                                            {s.slug === 'nuestra-historia' && 'Nuestra Historia'}
                                            {s.slug === 'contacto' && 'Contacto'}
                                        </button>
                                    ))}
                                </div>

                                {/* Formulario de Contenido de la Sección */}
                                <div className="md:col-span-9">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-bold">Cabecera de la Página</CardTitle>
                                            <CardDescription>Estás editando la apariencia visual pública de la sección.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={submitSectionSettings} className="space-y-4">
                                                {/* Banner actual */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Banner de Cabecera</label>
                                                    <div className="relative h-40 bg-gray-50 border border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center group">
                                                        {sectionPreview ? (
                                                            <img src={sectionPreview} alt="Banner" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-gray-400 flex flex-col items-center text-xs font-medium"><ImageIcon size={24} /> Sin imagen de fondo</div>
                                                        )}
                                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-2">
                                                            <ImageIcon size={16} /> Reemplazar Imagen (Recomendado 1920x400)
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={e => {
                                                                    const file = e.target.files?.[0] || null;
                                                                    sectionForm.setData('image', file);
                                                                    if (file) setSectionPreview(URL.createObjectURL(file));
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Título Principal</label>
                                                    <input
                                                        type="text"
                                                        value={sectionForm.data.title}
                                                        onChange={e => sectionForm.setData('title', e.target.value)}
                                                        className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subtítulo / Descripción Corta</label>
                                                    <textarea
                                                        value={sectionForm.data.description}
                                                        onChange={e => sectionForm.setData('description', e.target.value)}
                                                        rows={2}
                                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 resize-none"
                                                    />
                                                </div>

                                                {/* 🌟 TEXTO ENRIQUECIDO TIPTAP: Exclusivo para 'Nuestra Historia' */}
                                                {selectedSection.slug === 'about' && (
                                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cuerpo de la Página (Historia del Negocio)</label>
                                                        <RichTextEditor
                                                            content={sectionForm.data.content}
                                                            onChange={(html: string) => sectionForm.setData('content', html)}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex justify-end pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={sectionForm.processing}
                                                        className="h-10 bg-pink-500 hover:bg-pink-600 text-white px-5 text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                                                    >
                                                        <Save size={16} /> Guardar Cambios en Sección
                                                    </button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- PESTAÑA 3: SLIDER HERO --- */}
                        <TabsContent value="slider" className="mt-4 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-bold">Imágenes del Banner Principal (Hero)</CardTitle>
                                        <CardDescription>
                                            Subí las fotos que se mostrarán en el carrusel de la página de inicio.
                                        </CardDescription>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={resetSlider}
                                        className="text-xs font-bold text-gray-500 hover:text-pink-600 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:border-pink-200 transition-colors cursor-pointer"
                                    >
                                        <RotateCcw size={14} /> Restaurar por Defecto
                                    </button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Formulario de Subida Rápida */}
                                    <form onSubmit={submitNewSlide} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 space-y-1 w-full">
                                            <label className="text-xs font-bold uppercase text-gray-500">Título Opcional</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Tortas para Cumpleaños"
                                                value={newSlideForm.data.title}
                                                onChange={e => newSlideForm.setData('title', e.target.value)}
                                                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 w-full">
                                            <label className="text-xs font-bold uppercase text-gray-500">Seleccionar Imagen</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => newSlideForm.setData('image', e.target.files?.[0] || null)}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={newSlideForm.processing}
                                            className="h-10 bg-pink-500 hover:bg-pink-600 text-white font-bold px-5 rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            <Plus size={16} /> Cargar Imagen
                                        </button>
                                    </form>

                                    {/* Grilla de Imágenes Activas */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {slides.map((slide) => (
                                            <div key={slide.id} className="relative group bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 aspect-video">
                                                <img
                                                    src={slide.image_url}
                                                    alt={slide.title || 'Slide'}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-between">
                                                    <span className="self-start text-[10px] font-black uppercase tracking-wider bg-white/90 text-gray-900 px-2 py-0.5 rounded-md">
                                                        Posición #{slide.order}
                                                    </span>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs font-bold text-white truncate max-w-[150px]">
                                                            {slide.title || 'Sin título'}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteSlide(slide.id)}
                                                            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-colors cursor-pointer"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {slides.length === 0 && (
                                            <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                                                No hay imágenes cargadas en el slider.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </AppLayout>
    );
}