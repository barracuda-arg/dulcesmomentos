import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { User, ShoppingBag, Camera, Save, ArrowRight, Phone, Mail } from 'lucide-react';

interface OrderData {
    id: number;
    tracking_token: string;
    delivery_date: string;
    status_name: string;
    status_color: string;
    items_count: number;
}

interface ClientUser {
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
}

interface Props {
    orders: OrderData[];
    user: ClientUser;
}

export default function Dashboard({ orders, user }: Props) {
    // Formulario de perfil usando simulación PUT a través de POST para soportar archivos nativos
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: user.name,
        phone: user.phone || '',
        avatar: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(user.avatar_url);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('client.profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Mi Panel - Dulces Momentos" />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Encabezado General */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-950 tracking-tight">Hola, {user.name} 👋</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestioná tus datos personales y revisá el estado de tus pedidos de pastelería.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DE PERFIL */}
                    <div className="md:col-span-4 bg-gradient-to-br from-pink-50/30 to-white border border-pink-100/60 p-6 rounded-3xl shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                                <User size={16} className="text-pink-500" /> Mis Datos
                            </h2>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            {/* Selector de Avatar */}
                            <div className="flex flex-col items-center space-y-2">
                                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-pink-200 bg-gray-50 shadow-inner">
                                    {preview ? (
                                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={40} /></div>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera size={18} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null;
                                                setData('avatar', file);
                                                if (file) setPreview(URL.createObjectURL(file));
                                            }}
                                        />
                                    </label>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cambiar Foto</span>
                                {errors.avatar && <p className="text-xs font-bold text-red-500">{errors.avatar}</p>}
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-pink-500 transition-colors"
                                    />
                                    {errors.name && <p className="text-xs font-bold text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono de Contacto</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        placeholder="Ej: 3875xxxxxx"
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-pink-500 transition-colors"
                                    />
                                    {errors.phone && <p className="text-xs font-bold text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="space-y-1 opacity-70">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email (No modificable)</label>
                                    <div className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium flex items-center text-gray-500 gap-2">
                                        <Mail size={14} /> {user.email}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-10 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black rounded-xl shadow-md shadow-pink-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save size={14} />
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: HISTÓRICO "MIS PEDIDOS" */}
                    <div className="md:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="border-b border-gray-50 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                                <ShoppingBag size={16} className="text-pink-500" /> Historial de Pedidos ({orders.length})
                            </h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-xs text-gray-400 font-bold">Todavía no registraste ninguna compra en nuestro sistema.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-wrap items-center justify-between p-4 bg-gray-50/60 border border-gray-100 rounded-2xl gap-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-black text-gray-900">{order.tracking_token}</span>
                                                <span
                                                    className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                                                    style={{ backgroundColor: order.status_color }}
                                                >
                                                    {order.status_name}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">
                                                Entrega programada: <span className="font-bold text-gray-600">{order.delivery_date} hs</span> • {order.items_count} producto(s)
                                            </p>
                                        </div>

                                        <div>
                                            <Link
                                                href={route('order.track.form', { token: order.tracking_token })}
                                                className="inline-flex items-center gap-1.5 text-xs font-black text-pink-600 bg-pink-50 hover:bg-pink-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                                            >
                                                Ver Hoja de Ruta <ArrowRight size={13} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}