// resources/js/components/testimonials-section.tsx
import { Star, Quote } from "lucide-react";
import { ImageZoom } from "./zoom";

export function TestimonialsSection({ testimonials }) {

    // Componente para el avatar por defecto si no hay foto
    const DefaultAvatar = () => (
        <svg
            id="Layer_1"
            version="1.1"
            viewBox="0 0 512 512"
            className="w-30 h-30 shrink-0" // Controlamos el tamaño idéntico al de las fotos
            xmlns="http://www.w3.org/2000/svg"
        >
            <style type="text/css">
                {`.st0{fill:#F3AD2E;}`}
            </style>
            <g>
                <path className="st0" d="M256,28C130.1,28,28,130.1,28,256s102.1,228,228,228s228-102.1,228-228S381.9,28,256,28z M256,122 c36.7,0,66.5,29.8,66.5,66.5S292.7,255,256,255s-66.5-29.8-66.5-66.5S219.3,122,256,122z M363.5,351.2c0,21.3-17.4,38.7-38.7,38.7 H187.2c-21.3,0-38.7-17.4-38.7-38.7v-82c0-21.3,17.4-38.7,38.7-38.7h3.2c13.5,22,37.8,36.7,65.5,36.7s52-14.7,65.5-36.7h3.2 c21.3,0,38.7,17.4,38.7,38.7V351.2z" />
            </g>
        </svg>
    );

    return (
        <section className="bg-white overflow-hidden">
            <div className="container mx-auto px-4 py-10">
                {/* <div className="max-w-2xl mb-16">
                    <h2 className="text-4xl font-serif font-bold text-neutral-900 leading-tight">
                        Historias de <span className="text-pasteleria-rosa italic">momentos</span> compartidos
                    </h2>
                    <p className="text-neutral-500 mt-4 text-lg font-light">
                        Lo que nuestros clientes de Salta viven en cada festejo.
                    </p>
                </div> */}

                <div className="flex items-center justify-between mb-8">
                    <div className="w-full">
                        {/* <h2 className="text-3xl font-serif font-bold text-gray-900">Tentaciones Diarias</h2> */}
                        <h2 className="text-center text-3xl font-bold">Historias de <span className="text-pasteleria-rosa italic">momentos</span> compartidos</h2>
                        <p className="text-center text-neutral-500 mt-4 text-lg font-light">
                            Lo que nuestros clientes de Salta viven en cada festejo.
                        </p>
                    </div>
                </div>

                {/* Grilla con diseño asimétrico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12">
                    {testimonials.map((t, index) => (
                        <div
                            key={t.id}
                            className={`flex flex-col sm:flex-row gap-6 items-center sm:items-start ${index % 2 !== 0 ? 'md:mt-12' : '' // Desplazamiento visual para romper la grilla
                                }`}
                        >
                            {/* Imagen en Círculo con borde decorativo */}
                            <div className="relative shrink-0">
                                <div className="size-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-pasteleria-rosa/20">

                                    {t.productImage ? (
                                        <ImageZoom
                                            src={t.productImage}
                                            alt={t.client}
                                            className="w-full h-full object-cover cursor-pointer"
                                        />
                                        // <img
                                        //     src={t.productImage}
                                        //     alt="Producto entregado"
                                        //     className="w-full h-full object-cover"
                                        // />
                                    ) : (
                                        <DefaultAvatar />
                                    )}

                                </div>
                                {/* Icono de Quote flotante */}
                                <div className="absolute -bottom-2 -right-2 size-10 bg-pasteleria-rosa rounded-full flex items-center justify-center text-white shadow-lg">
                                    <Quote size={16} fill="currentColor" />
                                </div>
                            </div>

                            {/* Contenido del Testimonio sin contenedor tipo "Card" */}
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex justify-center sm:justify-start gap-0.5 mb-2 text-yellow-400">
                                    {/* {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))} */}
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>

                                <blockquote className="text-xl font-medium text-neutral-800 leading-snug mb-3">
                                    "{t.comment}"
                                </blockquote>

                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <span className="h-px w-6 bg-pasteleria-rosa/30"></span>
                                    <cite className="not-italic font-bold text-sm uppercase tracking-widest text-neutral-500">
                                        {t.client}
                                    </cite>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}