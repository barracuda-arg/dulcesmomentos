import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { SectionTitle } from '../section-title';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types/navigation';
import { ConfirmDeleteModal } from '../../confirm-delete-modal';

import Pagination from '@/components/pagination';
import { Edit2, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    is_active: boolean;
    published_at: string;
    image_url: string | null;
}

interface Props {
    posts: {
        data: Post[];
        links: any[];
    };
}

export default function Index({ posts, auth }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            module: 'Modulo de Novedades',
            title: 'Administrar Novedades 💬',
            href: '',
            action: 'list',
            btnAction: '+ Agregar novbedad',
        },
    ];

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    const openDeleteTarget = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleDelete = (id: number) => {
        openDeleteTarget(id);
    };

    const handleConfirmDelete = () => {
        if (!deleteModal.id) {
            return;
        }

        setProcessingDelete(true);

        router.delete(route('admin.posts.destroy', deleteModal.id), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, id: null });
            },
            onFinish: () => {
                setProcessingDelete(false);
            },
        });
    };

    return (
        <>
            <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
                <Head title="Reseñas de Clientes" />

                <div className="p-8 bg-gray-50 min-h-screen space-y-6">

                    {/* 🌟 Usamos tu SectionTitle con la acción configurada como link de redirección */}
                    <SectionTitle
                        lastBreadcrumb={{
                            title: 'Novedades y Sorteos',
                            href: route('admin.posts.create'),
                            btnAction: 'Nueva Publicación'
                        }}
                        actionType="link"
                    />

                    {/* Tabla de Contenidos */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {posts.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-500">
                                            <th className="py-4 px-6">Portada</th>
                                            <th className="py-4 px-6">Título</th>
                                            <th className="py-4 px-6">Fecha Pub.</th>
                                            <th className="py-4 px-6">Estado</th>
                                            <th className="py-4 px-6 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                                        {posts.data.map((post) => (
                                            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                                {/* Imagen Miniatura */}
                                                <td className="py-4 px-6">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                                                        {post.image_url ? (
                                                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-pink-50 text-pink-400 font-bold">
                                                                🍰
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Título */}
                                                <td className="py-4 px-6 font-bold text-gray-800">
                                                    {post.title}
                                                </td>

                                                {/* Fecha */}
                                                <td className="py-4 px-6 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={13} />
                                                        {post.published_at}
                                                    </div>
                                                </td>

                                                {/* Estado Activo / Oculto */}
                                                <td className="py-4 px-6">
                                                    {post.is_active ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black bg-green-50 text-green-700 rounded-full uppercase">
                                                            <Eye size={12} /> Publicado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black bg-gray-100 text-gray-500 rounded-full uppercase">
                                                            <EyeOff size={12} /> Borrador
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Botones de Acción */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('admin.posts.edit', post.id)}
                                                            className="p-2 text-gray-400 hover:text-pink-500 bg-gray-50 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                                                            title="Editar"
                                                        >
                                                            <Edit2 size={15} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-400">
                                No hay novedades ni anuncios cargados todavía. 📰
                            </div>
                        )}

                        {/* Paginación */}
                        {posts.data.length > 0 && (
                            <div className="p-6 border-t border-gray-50 flex justify-center">
                                <Pagination links={posts.links} />
                            </div>
                        )}
                    </div>

                </div>
                <ConfirmDeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                    processing={processingDelete}
                    title="¿Eliminar esta publicación?"
                    description="Esta acción no se puede deshacer. La publicación será eliminada permanentemente."
                />
            </AppLayout>
        </>
    );
}