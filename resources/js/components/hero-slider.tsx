import React, { useCallback } from 'react' // Importa useCallback
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// 👇 AGREGÁ ESTA LÍNEA 👇
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
    '/images/hero/11.jpg',
    '/images/hero/12.jpg',
    '/images/hero/13.jpg',
    '/images/hero/14.jpg',
    '/images/hero/15.jpg',
    '/images/hero/15.png',
];

export default function HeroSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ]);

    // Funciones para las flechas
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    // Función para los puntitos (dots)
    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index)
    }, [emblaApi])

    return (
        <div className="absolute inset-0 z-0 overflow-hidden group"> {/* Agregamos 'group' */}
            <div className="absolute inset-0" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {images.map((src, index) => (
                        <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                            <div className="absolute inset-0 bg-black/30 z-10" />
                            <img src={src} className="h-full w-full object-cover" alt="..." />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTONES DE NAVEGACIÓN --- */}

            {/* Flecha Izquierda */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-white/40"
            >
                <ChevronLeft size={32} />
            </button>

            {/* Flecha Derecha */}
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-white/40"
            >
                <ChevronRight size={32} />
            </button>

            {/* PUNTITOS (DOTS) ABAJO */}
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className="h-2 w-2 rounded-full bg-white/50 transition-all hover:bg-white"
                    />
                ))}
            </div>
        </div>
    )
}