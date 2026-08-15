// resources/js/components/testimonials-grid.tsx
import { Star } from "lucide-react";

const testimonials = [
    {
        id: 1,
        client: "María Luz",
        comment: "El Lemon Pie estaba increíble, el merengue en su punto justo. ¡Súper recomendado!",
        productImage: "/storage/products/lemon-pie-review.jpg", // Foto real enviada por cliente
        rating: 5
    },
    {
        id: 2,
        client: "Juan Pablo",
        comment: "Increíble presentación para el cumple de mi hija. Todos quedaron encantados con la torta de chocolate.",
        productImage: "/storage/products/torta-chocolate.jpg",
        rating: 5
    },
    // Agrega más según necesites
];

export function TestimonialsGrid() {
    return (
        <section className="bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 italic">Lo que dicen nuestros clientes</h2>
                    <div className="h-1 w-20 bg-pink-200 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="break-inside-avoid bg-pink-50/30 rounded-3xl p-6 border border-pink-100/50 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            {/* Imagen del Producto (La estrella del testimonio) */}
                            <div className="relative mb-6 overflow-hidden rounded-2xl aspect-video sm:aspect-square">
                                <img
                                    src={t.productImage}
                                    alt={`Pedido de ${t.client}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* Contenido de la Reseña */}
                            <div className="space-y-3">
                                <div className="flex gap-1 text-pink-400">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="size-4 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-700 leading-relaxed italic">
                                    "{t.comment}"
                                </p>

                                <div className="pt-4 border-t border-pink-100 flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold text-xs uppercase">
                                        {t.client.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-gray-900 text-sm">{t.client}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}