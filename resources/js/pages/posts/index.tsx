import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ArrowRight } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import SectionHeader from '../section-header';

interface PostIndexData {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string | null;
    published_at: string;
}

interface Props {
    posts: PostIndexData[];
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

// Imagen por defecto en caso de que falte portada
const getPublicAssetUrl = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (typeof window === 'undefined') {
        return normalizedPath;
    }

    return `${window.location.origin}${normalizedPath}`;
};

const resolveImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) {
        return getPublicAssetUrl('images/novedad.png');
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
        return imageUrl;
    }

    return getPublicAssetUrl(imageUrl);
};

export default function Index({ posts, section }: Props) {
    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
        <>
            <MainLayout>



                {/* <Head title="Novedades, Recetas y Sorteos - Díaz Pastelería" /> */}
                <Head title={`${section.title} - Dulces Momentos`} />

                {/* Cabecera administrada dinámicamente por Eliana */}
                <SectionHeader
                    title={section.title}
                    description={section.description}
                    content={section.content}
                    imageUrl={section.image_url}
                    highlightedText={section.highlighted_text}
                />

                <div className="bg-white min-h-screen text-gray-800">
                    {/* <div className="relative overflow-hidden bg-pink-50/30 border-b border-gray-100">
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/sections/novedad-section.jpg"
                                alt="Fondo Pastelería"
                                className="w-full h-full object-cover object-center opacity-[0.82] filter saturate-50 mix-blend-multiply"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />
                        </div>

                        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-100/60 px-3 py-1 rounded-full shadow-sm mb-3">
                                ✨ El rincón de la dulzura
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tight leading-none">
                                Novedades & Recetas
                            </h1>
                            <p className="text-sm md:text-base text-gray-500 mt-3 max-w-xl mx-auto font-medium leading-relaxed">
                                Enterate de nuestros próximos sorteos, tips de cocina de Eliana y el detrás de escena de nuestras tortas.
                            </p>
                        </div>
                    </div> */}

                    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-sm font-bold text-gray-400">Pronto subiremos las primeras novedades. ¡Estate atento!</p>
                            </div>
                        ) : (
                            <>
                                {/* Artículo Destacado (Rediseño Estilo Revista Premium) */}
                                {featuredPost && (
                                    <Link
                                        href={route('posts.show', featuredPost.slug)}
                                        className="group grid grid-cols-1 md:grid-cols-12 gap-8 bg-gradient-to-br from-pink-50/40 via-white to-white p-6 md:p-8 rounded-[32px] border border-pink-100/60 hover:border-pink-200 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(244,114,182,0.15)] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden"
                                    >
                                        {/* Detalle decorativo de fondo tipo destello sutil */}
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-300/30 transition-colors duration-500" />

                                        {/* Columna Izquierda: Imagen */}
                                        <div className="md:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] bg-gray-100 relative shadow-sm border border-gray-100">
                                            <img
                                                src={resolveImageUrl(featuredPost.image_url)}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover object-[center_20%] group-hover:scale-101 transition-transform duration-700 ease-out"
                                            />
                                            <span className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md shadow-pink-500/20 animate-pulse">
                                                ¡Lo Último! 🔥
                                            </span>
                                        </div>

                                        {/* Columna Derecha: Textos y Datos */}
                                        <div className="md:col-span-5 flex flex-col justify-center space-y-4 pr-2 z-10">
                                            <div className="flex items-center gap-2 text-[11px] text-pink-600 font-extrabold uppercase tracking-wider">
                                                <span className="flex h-2 w-2 rounded-full bg-pink-500" />
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {featuredPost.published_at}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl md:text-3xl font-black text-gray-950 leading-tight group-hover:text-pink-600 transition-colors duration-300 tracking-tight">
                                                {featuredPost.title}
                                            </h2>

                                            <p className="text-xs md:text-sm text-gray-500 line-clamp-3 leading-relaxed font-medium">
                                                {featuredPost.excerpt}
                                            </p>

                                            <div className="pt-2">
                                                <span className="inline-flex items-center gap-2 text-xs font-black text-gray-950 bg-gray-900 text-white group-hover:bg-pink-500 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm group-hover:translate-x-1">
                                                    Leer artículo
                                                    <ArrowRight size={13} className="text-pink-200 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Grilla Secundaria (Artículos Restantes) */}
                                {remainingPosts.length > 0 && (
                                    <div className="space-y-8">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">Más publicaciones</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {remainingPosts.map((post) => (
                                                <Link
                                                    key={post.id}
                                                    href={route('posts.show', post.slug)}
                                                    className="group flex flex-col space-y-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                                                >
                                                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-100">
                                                        <img
                                                            src={resolveImageUrl(post.image_url)}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover object-[center_20%] group-hover:scale-103 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-[11px] text-gray-400 font-bold">{post.published_at}</div>
                                                        <h4 className="text-lg font-black text-gray-950 group-hover:text-pink-500 transition-colors line-clamp-2 leading-snug">
                                                            {post.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </MainLayout>
        </>
    );
}