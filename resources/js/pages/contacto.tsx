import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
// import PublicLayout from '@/layouts/public-layout'; // Tu layout público con navbar y footer
import MainLayout from '@/layouts/main-layout';
import SectionHeader from './section-header';
import { PageProps } from '@/types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    section: {
        title: string;
        description: string | null;
        content: string | null;
        image_url: string | null;
    };
}

export default function Contact({ section }: Props) {

    // 🌟 Consumimos site_settings directamente de las props globales compartidas
    const { site_settings } = usePage<PageProps>().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contacto.send'), {
            onSuccess: () => {
                toast.success('¡Tu mensaje fue enviado con éxito! Te responderemos muy pronto.');
                reset();
            },
            onError: () => {
                toast.error('Hubo un problema al enviar tu mensaje. Revisá los campos.');
            },
        });
    };

    return (
        <MainLayout>
            <Head title={`${section.title} - Dulces Momentos`} />

            {/* Cabecera administrada dinámicamente por Eliana */}
            <SectionHeader
                title={section.title}
                description={section.description}
                imageUrl={section.image_url}
                content={section.content}
            />

            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Formulario de Contacto */}
                <div className="md:col-span-7 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Escribinos un mensaje</h2>
                        <p className="text-sm text-gray-500">
                            Completá el formulario para consultas, presupuestos o pedidos especiales.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-colors"
                                placeholder="Ej. Ana García"
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-colors"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Mensaje
                            </label>
                            <textarea
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                rows={5}
                                className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-colors resize-none"
                                placeholder="Escribí detalladamente tu consulta..."
                                required
                            />
                            {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Send size={18} /> {processing ? 'Enviando...' : 'Enviar Consulta'}
                        </button>
                    </form>
                </div>

                {/* Columna Lateral: Información e Iframe de Google Maps */}
                <div className="md:col-span-5 space-y-6">
                    <div className="bg-gray-50 rounded-3xl p-8 space-y-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Información del Negocio</h3>

                        <div className="space-y-4">
                            {site_settings?.business_address && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Ubicación
                                        </h4>
                                        <p className="text-sm font-medium text-gray-700">
                                            {site_settings.business_address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {site_settings?.whatsapp_number && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            WhatsApp Directo
                                        </h4>
                                        <a
                                            href={`https://wa.me/${site_settings.whatsapp_number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-pink-600 hover:underline"
                                        >
                                            {site_settings.whatsapp_number}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mapa Dinámico mediante Google Maps Embed */}
                    {site_settings?.latitude && site_settings?.longitude && (
                        <div className="h-64 bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${site_settings.latitude},${site_settings.longitude}&z=15&output=embed`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}