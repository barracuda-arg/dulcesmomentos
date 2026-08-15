import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button'; // Usando tus componentes de UI
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';
import { ConfirmDeleteModal } from '../../confirm-delete-modal';

interface Rate {
    id: number;
    max_distance_km: number;
    price: number;
}

interface Props {
    rates: Rate[];
}

export default function Index({ rates, auth }: Props) {

    // 1. Estado para manejar el modal y el ID a eliminar
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    });

    // 2. useForm de Inertia para procesar el delete al backend de Laravel
    // const { delete: destroy, processing } = useForm(); /// creo que ya esta

    const openDeleteTarget = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal.id) return;

        // Mandamos el DELETE a Laravel mediante Inertia
        // destroy(route('mi-registro.destroy', deleteModal.id), {
        //     onSuccess: () => closeDeleteModal(),
        // });

        destroy(route('admin.delivery-rates.destroy', deleteModal.id), {
            onSuccess: () => closeDeleteModal(),
        });
        // destroy(route('admin.delivery-rates.destroy', id));
    };





    const [editingId, setEditingId] = useState<number | null>(null);


    // Formulario de Inertia para Crear y Editar
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        max_distance_km: '',
        price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.delivery-rates.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post(route('admin.delivery-rates.store'), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const startEdit = (rate: Rate) => {
        clearErrors();
        setEditingId(rate.id);
        setData({
            max_distance_km: rate.max_distance_km.toString(),
            price: rate.price.toString(),
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este rango de precio?')) {
            destroy(route('admin.delivery-rates.destroy', id));
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Gestión de Tarifas de Envío" />

            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Configuración de Envíos</h1>
                    <p className="text-sm text-gray-500">Define los precios según la distancia en KM</p>
                </div>

                {/* FORMULARIO DE CARGA */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Hasta KM</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.max_distance_km}
                                onChange={e => setData('max_distance_km', e.target.value)}
                                placeholder="Ej: 3.5"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pasteleria-rosa/20 focus:border-pasteleria-rosa transition-all"
                            />
                            {errors.max_distance_km && <p className="text-red-500 text-[10px]">{errors.max_distance_km}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Precio ($)</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                placeholder="Ej: 1500"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pasteleria-rosa/20 focus:border-pasteleria-rosa transition-all"
                            />
                            {errors.price && <p className="text-red-500 text-[10px]">{errors.price}</p>}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className={`flex-1 h-[50px] rounded-xl font-bold ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pasteleria-rosa hover:bg-pink-600'}`}
                            >
                                {editingId ? <><Save size={18} className="mr-2" /> Guardar</> : <><Plus size={18} className="mr-2" /> Agregar</>}
                            </Button>

                            {editingId && (
                                <Button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-[50px] px-4 rounded-xl"
                                >
                                    <X size={20} />
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABLA DE RANGOS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Distancia Máxima</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Precio de Envío</th>
                                <th className="p-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rates.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-10 text-center text-gray-400 italic">No hay rangos definidos todavía.</td>
                                </tr>
                            ) : (
                                rates.map((rate) => (
                                    <tr key={rate.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === rate.id ? 'bg-blue-50/30' : ''}`}>
                                        <td className="p-4 font-medium text-gray-700 text-lg">
                                            Hasta {rate.max_distance_km} km
                                        </td>
                                        <td className="p-4 font-black text-pasteleria-rosa text-lg">
                                            ${new Intl.NumberFormat('es-AR').format(rate.price)}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => startEdit(rate)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                // onClick={() => handleDelete(rate.id)}
                                                onClick={() => openDeleteTarget(rate.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <p className="text-xs text-yellow-700 leading-relaxed">
                        <strong>Tip:</strong> Los precios se aplican buscando el primer rango que sea mayor o igual a la distancia calculada por Google.
                        Asegúrate de cubrir todas las posibilidades de Salta Capital (puedes poner un rango final de 99 km para el precio máximo).
                    </p>
                </div>
            </div>

            {/* 3. COLOCÁS EL MODAL REUTILIZABLE AL FINAL */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                processing={processing}
                // Opcional: Podés personalizar los textos si es para otra cosa
                title="¿Eliminar este elemento?"
            />




        </AppLayout>
    );
}