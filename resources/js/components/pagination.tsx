import React from 'react';
import { Link } from '@inertiajs/react';

// Definimos la estructura que nos manda Laravel de fondo
interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: LinkItem[];
}

export default function Pagination({ links }: PaginationProps) {
    // Si la cantidad de links es menor o igual a 3 significa que solo hay una página
    // (un link para 'Anterior', uno para la 'Página 1' y uno para 'Siguiente'), así que no renderizamos nada.
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-4 sm:px-6 mt-4 rounded-b-3xl">
            <div className="flex flex-1 justify-center sm:justify-end">
                <nav className="inline-flex -space-x-px rounded-xl shadow-sm bg-gray-50 p-1 gap-1" aria-label="Pagination">
                    {links.map((link, key) => {
                        // Laravel a veces manda entidades HTML como &laquo; o &raquo; para las flechas
                        // Reemplazamos visualmente para que quede impecable el texto
                        let label = link.label;
                        if (label.includes('Anterior')) label = '«';
                        if (label.includes('Siguiente')) label = '»';

                        // Si no hay URL (botón deshabilitado, ej: estás en la pág 1 y tocás 'Anterior')
                        if (link.url === null) {
                            return (
                                <span
                                    key={key}
                                    className="inline-flex items-center px-4 h-9 text-xs font-black text-gray-300 cursor-not-allowed select-none"
                                >
                                    {label}
                                </span>
                            );
                        }

                        // El botón linkeable común de Inertia
                        return (
                            <Link
                                key={key}
                                href={link.url}
                                preserveScroll // 🌟 Vital para que Eliana no pierda el scroll al cambiar de página
                                className={`inline-flex items-center px-4 h-9 text-xs font-black rounded-lg transition-all duration-200 ${link.active
                                    ? 'bg-pink-500 text-white shadow-sm' // Estilo activo (Página actual)
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700' // Estilo común
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}