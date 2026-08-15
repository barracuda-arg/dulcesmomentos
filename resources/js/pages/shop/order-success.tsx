import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { CheckCircle, Truck, Package } from 'lucide-react';

export default function OrderSuccess({ order }) {
    window.dispatchEvent(new Event('cart-updated'));
    return (
        <MainLayout>

            <Head title="¡Pedido Confirmado!" />
            <div className="container mx-auto p-8 text-center max-w-xl">
                <CheckCircle className="mx-auto text-green-500 size-20 mb-6" />
                <h1 className="text-4xl font-black text-gray-900 mb-2">¡Gracias por tu compra!</h1>
                <p className="text-gray-500 mb-8 text-lg">Tu pedido ya está en manos de Eliana.</p>

                <div className="bg-pink-50 border-2 border-pink-100 rounded-3xl p-8 mb-8 shadow-sm">
                    <p className="text-pink-400 font-bold uppercase tracking-widest text-sm mb-2">Código de Seguimiento</p>
                    <h2 className="text-5xl font-mono font-black text-pink-600 mb-4">{order.tracking_token}</h2>

                    {/* Badge dinámico con el color de tu Seeder */}
                    <div className="inline-block px-4 py-2 rounded-full text-white font-bold text-sm"
                        style={{ backgroundColor: order.status.color }}>
                        Estado: {order.status.name}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Link href="/">
                        <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold">
                            Volver al Inicio
                        </button>
                    </Link>
                    <p className="text-xs text-gray-400">
                        Te enviamos un resumen a tu email y podés consultar el estado con este código cuando quieras.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
