import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import { Link } from "@inertiajs/react"

export function DailyTemptations({ products }) {
    if (products.length === 0) return null;

    // 1. Creamos la referencia del plugin
    // Importante: stopOnInteraction: false permite que podamos manejarlo manualmente
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    )
    return (
        <section className="py-12 bg-pink-50/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="w-full">
                        {/* <h2 className="text-3xl font-serif font-bold text-gray-900">Tentaciones Diarias</h2> */}
                        <h2 className="text-center text-3xl font-bold">Tentaciones Diarias</h2>
                        <p className="text-center text-pink-600 font-medium">¡Listas para retirar hoy!</p>
                    </div>
                </div>
                {/* Contenedor del Carrusel al 50% de la pantalla aprox */}
                <div className="max-w-5xl mx-auto">
                    <Carousel
                        plugins={[plugin.current]}
                        // plugins={[
                        //
                        //     Autoplay({
                        //         delay: 3000,
                        //         stopOnInteraction: false, // Se detiene permanentemente si el usuario toca el carrusel
                        //     }),
                        // ]}
                        opts={{
                            align: "start",
                            loop: true,
                            duration: 50,
                        }}
                        className="w-full"
                        onMouseEnter={() => plugin.current.stop()}
                        onMouseLeave={() => plugin.current.play()}
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {products.map((product) => (
                                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">

                                    <Link href={route('products.show', product.slug)}>
                                        {/* <Card className="border-none my-6 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden group"> */}
                                        <Card className="border-none py-0 my-6 group rounded-none shadow-none border-none">
                                            <CardContent className="p-0 h-full">
                                                <div className="shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden rounded-xl border-none shadow-sm"> {/*eiliminar*/}
                                                    <div className="relative aspect-[4/5]">
                                                        <img
                                                            src={`${product.image?.includes('demo') ? product.image : `/storage/${product.image}`}`}
                                                            alt={product.name}
                                                            className="object-cover w-full h-full transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                            <span className="text-white font-medium">Ver detalles</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white text-center">
                                                        <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                                                        <p className="text-pink-600 font-bold">
                                                            ${new Intl.NumberFormat('es-AR').format(product.price)}
                                                        </p>
                                                    </div>
                                                </div> {/*eiliminar*/}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="hidden md:block">
                            <CarouselPrevious className="-left-30 size-20 h-16 w-16 text-pink-600 hover:bg-pasteleria-rosa hover:text-white cursor-pointer transition duration-300 hover:-translate-x-1" />
                            <CarouselNext className="-right-30 size-20 h-16 w-16 text-pink-600 hover:bg-pasteleria-rosa hover:text-white cursor-pointer transition-transform duration-300 hover:translate-x-1" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section >
    )
}