import React from 'react';
import { getImagePath } from '@/utils/formatters';

interface SectionHeaderProps {
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    highlightedText?: string | null; // Nueva propiedad opcional para resaltar texto
    content: string | null;
}

export default function SectionHeader({ title, description, imageUrl, highlightedText, content }: SectionHeaderProps) {
    return (
        <>
            <div className="relative h-64 md:h-80 bg-gray-950 flex items-center justify-center overflow-hidden">
                {/* Imagen de fondo dinámica */}
                {imageUrl ? (
                    <img
                        // src={imageUrl}
                        src={getImagePath(imageUrl)}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                ) : (
                    // Fondo por defecto en degradé pastel por si Eliana no subió foto
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 via-rose-50 to-amber-50 opacity-20" />
                )}

                {/* Contenido del Título */}
                {/* <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm md:text-base text-gray-200 font-medium max-w-xl mx-auto drop-shadow-sm">
                        {description}
                    </p>
                )}
            </div> */}
                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-2">
                    {highlightedText && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-100 px-3 py-1 rounded-full shadow-sm mb-3">
                            {highlightedText}
                        </span>
                    )}
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                        {title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-200 font-medium max-w-xl mx-auto drop-shadow-sm">
                        {description}
                    </p>
                </div>
            </div>
            {/* Contenido Enriquecido de la Historia */}
            {content && (
                <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
                    <article
                        className="prose prose-pink max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            )}
        </>

    );
}