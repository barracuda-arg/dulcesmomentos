import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-neutral-50 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {/* COLUMNA 1: LOGO E HISTORIA */}
                    <div>
                        <Link href="/" className="text-xl font-bold text-pasteleria-rosa">
                            Dulces Momentos
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed">
                            Repostería artesanal con el sabor de casa.
                            Llevamos la dulzura de la familia Díaz a cada rincón de Salta.
                        </p>
                    </div>

                    {/* COLUMNA 2: ENLACES RÁPIDOS */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                            Navegación
                        </h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><Link href={route('catalog')} className="hover:text-pasteleria-rosa transition">Nuestro Catálogo</Link></li>
                            <li><Link href="/nosotros" className="hover:text-pasteleria-rosa transition">Nuestra Historia</Link></li>
                            <li><Link href="/contacto" className="hover:text-pasteleria-rosa transition">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: CONTACTO LOCAL */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                            Contacto
                        </h4>
                        <ul className="mt-4 space-y-2 text-sm ">
                            <li>Salta, Argentina</li>
                            <li className="font-semibold text-pasteleria-rosa">
                                <a href="https://wa.me/tu-numero" target="_blank">WhatsApp: 387-XXX-XXXX</a>
                            </li>
                            <li>Instagram: @dulcesmomentos.salta</li>
                        </ul>
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