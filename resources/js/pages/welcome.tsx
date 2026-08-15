import HeroSlider from '@/components/hero-slider';
import MainLayout from '@/layouts/main-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import ProductCard from '@/components/product-card';
import { DailyTemptations } from './daily-temptations';
import AppLogoIcon from '@/components/app-logo-icon';
import { TestimonialsGrid } from './testimonials-grid';
import { TestimonialsSection } from './testimonials-bubbles';


export default function Welcome({ products, categories, canRegister, dailyTemptations, approvedFeedbacks = [] }: any) {

    const testimonials = [
        {
            id: 1,
            client: "María Luz",
            comment: "El Lemon Pie estaba increíble, el merengue en su punto justo. ¡Súper recomendado!",
            productImage: "/images/products/demo-1.jpg", // Foto real enviada por cliente
            rating: 5
        },
        {
            id: 2,
            client: "Juan Pablo",
            comment: "Increíble presentación para el cumple de mi hija. Todos quedaron encantados con la torta de chocolate.",
            productImage: "/images/products/demo-3.jpg",
            rating: 5
        },
        {
            id: 3,
            client: "María Luz",
            comment: "El Lemon Pie estaba increíble, el merengue en su punto justo. ¡Súper recomendado!",
            productImage: "/images/products/demo-4.jpg", // Foto real enviada por cliente
            rating: 4
        },
        {
            id: 4,
            client: "Juan Pablo",
            comment: "Increíble presentación para el cumple de mi hija. Todos quedaron encantados con la torta de chocolate.",
            productImage: "/images/products/demo-5.jpg",
            rating: 3
        },
        {
            id: 5,
            client: "María Luz",
            comment: "El Lemon Pie estaba increíble, el merengue en su punto justo. ¡Súper recomendado!",
            productImage: "/images/products/demo-2.jpg", // Foto real enviada por cliente
            rating: 4
        },
        {
            id: 6,
            client: "Juan Pablo",
            comment: "Increíble presentación para el cumple de mi hija. Todos quedaron encantados con la torta de chocolate.",
            productImage: "/images/products/demo-6.jpg",
            rating: 3
        },
        // Agrega más según necesites
    ];
    // 🌟 3. FUSIONAMOS AMBOS MUNDOS en una sola constante
    // Ponemos las reales de la BD primero para que tengan prioridad en la pantalla
    const allTestimonials = [...approvedFeedbacks, ...testimonials];

    console.log('Productos:', products);
    const [selectedCategory, setSelectedCategory] = useState('all');


    console.log('=>', products);
    // Lógica de filtrado en el cliente
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category.slug === selectedCategory);

    return (
        <MainLayout>
            <Head title="Inicio" />

            {/* HERO SECTION */}
            {/* <section className="bg-pasteleria-claro py-20 md:py-32">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold text-pasteleria-rosa md:text-7xl">
                        Dulces Momentos
                    </h1>
                    <p className="mt-6 text-xl">
                        Pastelería artesanal en Salta. Hecho en familia, con amor.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link href={route('catalog')} className="rounded-full bg-pasteleria-rosa px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105">
                            Explorar Catálogo
                        </Link>
                    </div>
                </div>
            </section> */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">

                {/* EL SLIDER DE FONDO */}
                <HeroSlider />

                {/* CONTENIDO FIJO ENCIMA */}
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl font-extrabold text-pasteleria-rosa text-shadow-lg/20">
                        Dulces Momentos
                    </h1>
                    <p className="mt-6 text-xl text-white font-medium">
                        Pastelería artesanal en Salta. Hecho en familia, con amor.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link href={route('catalog.index')}
                            // className="rounded-full bg-pasteleria-rosa px-8 py-3 font-bold text-white shadow-xl transition hover:scale-105 active:scale-95"
                            className="animate-shimmer group relaprincipaltive flex items-center gap-2 rounded-full bg-pasteleria-rosa px-10 py-4 text-lg font-bold text-white shadow-[0_10px_25px_-5px_rgba(244,114,182,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_35px_-10px_rgba(244,114,182,0.6)] active:scale-95"
                        >
                            <span className='text-white'>Explorar Catálogo</span>
                            {/* Flechita que se mueve al hacer hover */}
                            <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE CATEGORÍAS (Placeholder) */}
            {/* <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-center text-3xl font-bold">Nuestras Especialidades</h2>
                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                        //////////////////  Aquí irán las Cards de productos más adelante //////////////////
                        <div className="h-40 rounded-xl bg-neutral-100 p-6 shadow-sm flex items-center justify-center italic">
                            Próximamente: Tortas, Postres y más...
                        </div>
                    </div>
                </div>
            </section> */}

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-subtitulo-berenjena mb-10">
                        Creaciones por Encargo
                    </h2>

                    {/* FILTROS */}
                    <div className="flex justify-center gap-4 mb-12 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'all' ? 'bg-pasteleria-rosa text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === cat.slug ? 'bg-pasteleria-rosa text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* GRID DE PRODUCTOS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
            {/* SECCIÓN DE CATEGORÍAS (Placeholder) */}
            <section className="">
                {/* <div className="container mx-auto px-6"> */}
                <div className="w-full">
                    <DailyTemptations products={dailyTemptations} />
                </div>
            </section>

            {/* SECCIÓN DE NUESTROS CLIENTES (Placeholder) */}
            <section className="bg-white overflow-hidden">
                {/* <div className="container mx-auto px-6"> */}
                <div className="w-full">
                    <TestimonialsSection testimonials={allTestimonials} />
                </div>
            </section>



            {/* <div className="relative h-24 bg-white flex flex-col items-center py-8 mb-10">

                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-pasteleria-rosa/30 to-transparent" />


                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white px-4">
                        <div className="size-2 rounded-full bg-pasteleria-rosa/40 ring-8 ring-white" />
                    </div>
                </div>
                <img src="/images/logo_06.png" className="h-20 w-auto opacity-80" alt="Logo final" />
            </div> */}


            {/* <div className="w-full overflow-hidden leading-[0] rotate-180">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-[60px] fill-neutral-50/50"
                >
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.96C25.54,55.52,105.56,76.39,172,81.45,243.39,86.9,285.42,70.88,321.39,56.44Z"></path>
                </svg>
            </div> */}

            <div className="flex flex-col items-center bg-neutral-50/50 py-4 mb-4">
                <div className="flex items-center w-full max-w-xs gap-4 mb-4">
                    <div className="h-px flex-1 bg-pasteleria-rosa/20" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-pasteleria-rosa/60 font-medium">
                        Hecho con amor
                    </span>
                    <div className="h-px flex-1 bg-pasteleria-rosa/20" />
                </div>


                <img src="/images/logo_06.png" className="h-20 w-auto opacity-80" alt="Logo final" />
            </div>

            {/* SECCIÓN FOOTER LOGO */}
            {/* <section className="">
                <div className="w-full">
                    <section className="bg-neutral-50/50">
                        <div className="container mx-auto px-4">
                            <div className="items-center justify-between">
                                <div className="w-full">
                                    <h2 className="text-center text-3xl font-bold"></h2>
                                    <p className="text-center text-pink-600 font-medium"></p>
                                </div>
                                <div className="grid h-40 place-items-center ">
                                    <div className="h-30 w-30 ">
                                        <AppLogoIcon className="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section > */}
        </MainLayout >
    );
}