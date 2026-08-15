import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
// import AdminLayout from '@/layouts/admin-layout'; // Tu layout de administración
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, LayoutTemplate, Store, Image as ImageIcon, Globe } from 'lucide-react';
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
}

export default function SiteIndex({ sections, settings }: Props) {

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
                        <TabsList className="grid w-full grid-cols-2 max-w-md">
                            <TabsTrigger value="general" className="flex items-center gap-2">
                                <Store size={16} /> Datos del Negocio
                            </TabsTrigger>
                            <TabsTrigger value="sections" className="flex items-center gap-2">
                                <LayoutTemplate size={16} /> Secciones del Sitio
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
                    </Tabs>
                </div>

            </div>
        </AppLayout>
    );
}