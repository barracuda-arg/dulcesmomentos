import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';

interface PostShowData {
    title: string;
    content: string;
    image_url: string | null;
    video_url: string | null;
    published_at: string;
}

interface Props {
    post: PostShowData;
}

export default function Show({ post }: Props) {
    return (
        <>
            <MainLayout>
                <Head title={`${post.title} - Díaz Pastelería`} />

                <div className="bg-white min-h-screen pb-20 text-gray-800 selection:bg-pink-100">

                    {/* Botón Flotante/Superior de Regreso */}
                    <div className="max-w-3xl mx-auto px-6 pt-8">
                        <Link
                            href={route('posts.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-950 transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={14} /> Volver a todas las novedades
                        </Link>
                    </div>

                    {/* Artículo Principal */}
                    <article className="max-w-3xl mx-auto px-6 mt-6 space-y-8">

                        {/* Encabezado */}
                        <div className="space-y-3 text-center md:text-left">
                            <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-gray-50 px-3 py-1.5 rounded-full">
                                <Calendar size={13} className="text-pink-500" />
                                Publicado el {post.published_at}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight md:leading-none">
                                {post.title}
                            </h1>
                        </div>

                        {/* Portada de impacto */}
                        {post.image_url && (
                            <div className="rounded-3xl overflow-hidden shadow-xl shadow-pink-50/20 aspect-[16/9] border border-gray-100 bg-gray-50">
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Contenido Inyectado Rich Text (Tiptap) */}
                        {/* Estilizamos las etiquetas nativas que devuelve Tiptap mediante CSS anidado */}
                        <div className="post-content-container text-gray-700 leading-relaxed font-medium text-base space-y-4">
                            <div
                                dangerouslySetInnerHTML={{ __html: post.content }}
                                className="prose prose-pink max-w-none
                                     prose-headings:font-black prose-headings:text-gray-950 prose-headings:tracking-tight
                                     prose-p:mb-4 prose-p:leading-relaxed
                                     prose-strong:font-black prose-strong:text-gray-950
                                     prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                                     [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-6 [&_img]:mx-auto [&_img]:max-h-[450px] [&_img]:object-cover"
                            />
                        </div>

                        {/* Footer con Video HTML5 (Prioridad 1 completada!) 🎉 */}
                        {post.video_url && (
                            <div className="pt-8 border-t border-gray-100 mt-12 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 bg-pink-50 text-pink-500 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                    </span>
                                    <h4 className="text-sm font-black text-gray-950 uppercase tracking-wider">Video Demostrativo</h4>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-black aspect-video">
                                    <video
                                        src={post.video_url}
                                        controls
                                        controlsList="nodownload"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}

                    </article>
                </div>
            </MainLayout>
        </>
    );
}