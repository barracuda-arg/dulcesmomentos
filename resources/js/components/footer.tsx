import { MapPin, Phone, Mail } from 'lucide-react';
import { FacebookIcon } from '@/components/shared/icons/FacebookIcon';
import { InstagramIcon } from '@/components/shared/icons/InstagramIcon'; // ✅ Resolves perfectly
import { WhatsAppIcon } from '@/components/shared/icons/WhatsAppIcon'; // ✅ Funciona perfectamente


import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from './ui/button';
interface Props {
    sections: [{
        title: string;
        description: string | null;
        content: string | null;
        image_url: string | null;
    }];
}

export default function Footer({ sections }: Props) {
    const currentYear = new Date().getFullYear();
    const { site_settings } = usePage<PageProps>().props;

    return (
        <footer className="border-t bg-neutral-50 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {/* COLUMNA 1: LOGO E HISTORIA */}
                    <div>
                        <Link href="/" className="text-xl font-bold text-pasteleria-rosa">
                            Dulces Momentos
                        </Link>
                        {site_settings?.texto_pie_de_pagina && (
                            <p className="mt-4 text-sm leading-relaxed">
                                {site_settings.texto_pie_de_pagina}
                            </p>
                        )}
                    </div>

                    {/* COLUMNA 2: ENLACES RÁPIDOS */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                            Navegación
                        </h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            {sections.map((section) => (
                                <li key={section.title}>
                                    <Link href={`/${section.slug}`} className="hover:text-pasteleria-rosa transition">
                                        {section.title}
                                    </Link>
                                </li>
                            ))}

                            {/* <li><Link href={route('catalog.index')} className="hover:text-pasteleria-rosa transition">Nuestro Catálogo</Link></li>
                            <li><Link href="/nosotros" className="hover:text-pasteleria-rosa transition">Nuestra Historia</Link></li>
                            <li><Link href="/contacto" className="hover:text-pasteleria-rosa transition">Contacto</Link></li> */}
                        </ul>
                    </div>

                    {/* COLUMNA 3: CONTACTO LOCAL */}
                    {/* <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                            Contacto
                        </h4>
                        <ul className="mt-4 space-y-2 text-sm ">
                            {
                                site_settings?.contact_email && (
                                    <li>{site_settings.contact_email}</li>
                                )
                            }
                            {
                                site_settings?.whatsapp_number && (
                                    <li className="font-semibold text-pasteleria-rosa">
                                        <a href={`https://wa.me/${site_settings.whatsapp_number}`} target="_blank">
                                            WhatsApp: {site_settings.whatsapp_number}
                                        </a>
                                    </li>
                                )
                            }
                            {
                                site_settings?.instagram_profile && (
                                    <li>Instagram: {site_settings.instagram_profile}</li>
                                )
                            }
                            {
                                site_settings?.facebook_profile && (
                                    <li>Facebook: {site_settings.facebook_profile}</li>
                                )
                            }
                            <li>Salta, Argentina</li>
                        </ul>
                    </div> */}
                    {/* COLUMNA 3: CONTACTO Y REDES SOCIALES */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                            Contacto
                        </h4>

                        <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                            {/* Email */}
                            {site_settings?.contact_email && (
                                <li>
                                    <a
                                        href={`mailto:${site_settings.contact_email}`}
                                        className="flex items-center gap-2.5 hover:text-pasteleria-rosa transition-colors"
                                    >
                                        <Mail size={16} className="text-pasteleria-rosa shrink-0" />
                                        <span>{site_settings.contact_email}</span>
                                    </a>
                                </li>
                            )}

                            {/* WhatsApp */}

                            {/* Ubicación */}
                            <li className="flex items-center gap-2.5">
                                <MapPin size={16} className="text-pasteleria-rosa shrink-0" />
                                <span>{site_settings?.business_address || 'Salta, Argentina'}</span>
                            </li>
                        </ul>

                        {/* Íconos de Redes Sociales estilizados */}
                        {(site_settings?.instagram_profile || site_settings?.facebook_profile) && (
                            <div className="mt-5 pt-4 border-t border-neutral-200/60">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                                    Síguenos
                                </span>
                                <div className="flex items-center gap-3">
                                    {site_settings?.instagram_profile && (
                                        <a
                                            href={site_settings.instagram_profile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-neutral-100 text-pink-600 hover:bg-pink-50 hover:text-pink-600 hover:scale-105 transition-all duration-200"
                                            title="Instagram"
                                        >
                                            <InstagramIcon className="h-5 w-5" size={18} />
                                            {/* <span>Siguenos</span> */}

                                            {/* <Button variant="ghost" className="hover:bg-pink-50">
                                                <InstagramIcon className="h-5 w-5 text-[#E1306C]" />
                                                <span>Follow us</span>
                                            </Button> */}

                                        </a>
                                    )}

                                    {site_settings?.facebook_profile && (
                                        <a
                                            href={site_settings.facebook_profile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-200"
                                            title="Facebook"
                                        >
                                            <FacebookIcon className="h-5 w-5 text-[#1877F2]" size={18} />
                                        </a>
                                    )}
                                    {site_settings?.whatsapp_number && (
                                        <a
                                            href={`https://wa.me/${site_settings.whatsapp_number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-neutral-100 text-green-600 hover:bg-green-50 hover:text-green-600 hover:scale-105 transition-all duration-200"
                                            title="WhatsApp"
                                        >
                                            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BARRA INFERIOR: COPYRIGHT */}
                <div className="mt-12 border-t pt-8 text-center text-xs text-neutral-500">
                    <p>© {currentYear} Dulces Momentos. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}