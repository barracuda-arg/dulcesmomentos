import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/components/pagination';
import MainLayout from '@/layouts/main-layout';
import SectionHeader from '../section-header';
import { ShoppingBag, Filter, CheckCircle2, Search, X } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count?: number; // Por si después querés mandar el conteo desde Laravel
}

interface Product {
    id: number;
    slug: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_name: string;
}

interface Props {
    productsPaginated: {
        data: Product[];
        links: any[];
    };
    categories: Category[];
    currentCategory: string | null;
    filters: { buscar: string | null }; // 🌟 NUEVO
}

interface Props {
    section: {
        title: string;
        description: string | null;
        content: string | null;
        image_url: string | null;
        highlighted_text: string | null; // Nueva propiedad opcional para resaltar texto
    };
}
export default function Index({ productsPaginated, categories, currentCategory, section, filters }: Props) {
    const products = productsPaginated.data;

    // Estado local para disparar la animación de entrada cada vez que cambian los productos
    const [animate, setAnimate] = useState(false);

    // 🌟 Estado local para el texto que escribe el usuario
    const [searchQuery, setSearchQuery] = useState(filters.buscar || '');
    // 🌟 Función para disparar la búsqueda en el Backend
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(
            route('catalog.index'),
            {
                categoria: currentCategory || undefined, // Mantiene la categoría si ya había una
                buscar: searchQuery || undefined         // Envía el texto o limpia el parámetro si está vacío
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    // 🌟 Función para limpiar el buscador al toque
    const handleClearSearch = () => {
        setSearchQuery('');
        router.get(
            route('catalog.index'),
            { categoria: currentCategory || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };


    useEffect(() => {
        setAnimate(false);
        const timer = setTimeout(() => setAnimate(true), 50);
        return () => clearTimeout(timer);
    }, [currentCategory, productsPaginated]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <>
            <MainLayout>
                <Head title={`${section.title} - Dulces Momentos`} />
                <SectionHeader
                    title={section.title}
                    description={section.description}
                    content={section.content}
                    imageUrl={section.image_url}
                    highlightedText={section.highlighted_text}
                />
                <div className="min-h-screen bg-[#FAFAFA] pb-20">

                    {/* Cabecera Minimalista y Sofisticada */}
                    {/* <div className="bg-white border-b border-gray-100 py-10 px-4 text-center">
                        <span className="text-[11px] font-black tracking-widest text-pink-500 uppercase">Exquisiteces Hechas a Mano</span>
                        <h1 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">Catálogo de Tentaciones 🎂</h1>
                        <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
                            Filtrá por categoría y encontrá el mimo perfecto para tu día especial.
                        </p>
                    </div> */}

                    {/* Contenedor Principal: Dos Columnas */}
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-10">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                            {/* 1. SIDEBAR DE FILTROS (Columna Izquierda) */}
                            <aside className="w-full lg:w-64 shrink-0 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-6">
                                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-50 text-gray-800">
                                    <Filter size={16} className="text-pink-500" />
                                    <h2 className="text-xs font-black uppercase tracking-wider">Categorías</h2>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    {/* Opción: Ver Todo */}
                                    <Link
                                        href={route('catalog.index')}
                                        preserveScroll
                                        className={`flex items-center justify-between px-4 py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer group ${!currentCategory
                                            ? 'bg-pink-500 text-white shadow-md shadow-pink-100'
                                            : 'text-gray-600 hover:bg-pink-50/50 hover:text-pink-600'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            ✨ Ver todo el menú
                                        </span>
                                    </Link>

                                    {/* Lista de Categorías de la BD */}
                                    {categories.map((category) => {
                                        const isSelected = currentCategory === category.slug;
                                        return (
                                            <Link
                                                key={category.id}
                                                href={route('catalog.index', { categoria: category.slug })}
                                                preserveScroll
                                                className={`flex items-center justify-between px-4 py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer group ${isSelected
                                                    ? 'bg-pink-500 text-white shadow-md shadow-pink-100'
                                                    : 'text-gray-600 hover:bg-pink-50/50 hover:text-pink-600'
                                                    }`}
                                            >
                                                <span>{category.name}</span>
                                                {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </aside>

                            {/* 2. GRILLA DE PRODUCTOS (Columna Derecha) */}
                            <div className="flex-grow w-full space-y-8">
                                {/* 🌟 NUEVO: BARRA DE BÚSQUEDA */}
                                <div className="grid justify-center w-full">
                                    <form onSubmit={handleSearch} className="w-full max-w-md ml-auto flex gap-2">
                                        <div className="relative flex-grow">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                placeholder="Ej: Spiderman, Ben 10, Letras..."
                                                className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white border border-gray-100 text-xs font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-100 transition-all shadow-sm"
                                            />
                                            <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />

                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="h-11 px-5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black rounded-2xl shadow-md shadow-pink-100 transition-colors cursor-pointer"
                                        >
                                            Buscar
                                        </button>
                                    </form>
                                </div>
                                {products.length > 0 ? (
                                    <div
                                        className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-500 ease-out transform ${animate
                                            ? 'opacity-100 translate-y-0 scale-100'
                                            : 'opacity-0 translate-y-4 scale-[0.98]'
                                            }`}
                                    >
                                        {products.map((product, index) => (
                                            <div
                                                key={product.id}
                                                style={{ transitionDelay: `${index * 50}ms` }} // Efecto cascada por tarjeta
                                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                                            >
                                                {/* Contenedor Imagen */}
                                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>

                                                {/* Contenedor Textos */}
                                                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-wider">
                                                            {product.category_name}
                                                        </span>
                                                        <h3 className="font-black text-gray-800 text-base leading-tight group-hover:text-pink-500 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-medium">
                                                            {product.description || 'Preparado artesanalmente con ingredientes premium.'}
                                                        </p>
                                                    </div>

                                                    {/* Footer Tarjeta */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                        <span className="text-base font-black text-gray-950 tracking-tight">
                                                            {formatCurrency(product.price)}
                                                        </span>

                                                        <Link
                                                            href={route('products.show', product.slug)}
                                                            className="h-9 px-4 bg-gray-900 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 duration-200 cursor-pointer"
                                                        >
                                                            Pedir
                                                            <ShoppingBag size={12} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-sm font-bold text-gray-400">No hay delicias cargadas en esta sección por el momento. 🍰</p>
                                    </div>
                                )}

                                {/* Paginación */}
                                {products.length > 0 && (
                                    <div className="flex justify-center pt-4">
                                        <Pagination links={productsPaginated.links} />
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>



            </MainLayout>
        </>
    );
}