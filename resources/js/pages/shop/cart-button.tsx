// import React, { useState, useEffect } from 'react';
// import { ShoppingCart } from 'lucide-react';

// export const CartButton = () => {
//     const [itemCount, setItemCount] = useState(0);

//     const updateCount = () => {
//         const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//         // Sumamos todas las cantidades de los productos en el carrito
//         const total = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
//         setItemCount(total);
//     };

//     useEffect(() => {
//         // Carga inicial
//         updateCount();

//         // Escuchar cambios en el localStorage (útil entre pestañas)
//         window.addEventListener('storage', updateCount);

//         // Evento personalizado para cambios en la misma pestaña
//         window.addEventListener('cart-updated', updateCount);

//         return () => {
//             window.removeEventListener('storage', updateCount);
//             window.removeEventListener('cart-updated', updateCount);
//         };
//     }, []);

//     return (
//         <button className="relative p-2 text-gray-600 hover:text-pasteleria-rosa transition-colors">
//             <ShoppingCart className="h-6 w-6" />
//             {itemCount > 0 && (
//                 <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pasteleria-rosa rounded-full">
//                     {itemCount}
//                 </span>
//             )}
//         </button>
//     );
// };
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react'; // Cambiamos router por Link
import { ShoppingCart } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export const CartButton = () => {
    const [itemCount, setItemCount] = useState(0);
    const [isAnimate, setIsAnimate] = useState(false);

    const updateCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);

        setItemCount(total);

        // Disparamos la animación
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 300); // Duración de la animación
    };

    useEffect(() => {
        updateCount();
        window.addEventListener('storage', updateCount);
        window.addEventListener('cart-updated', updateCount);

        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('cart-updated', updateCount);
        };
    }, []);

    const loadItems = () => {
        // Aquí podrías agregar lógica para cargar el carrito o redirigir al usuario
        // Por ejemplo, podrías usar Inertia para navegar a la página del carrito:
        // router.get(route('cart'));
        router.get(route('cart.index'));
    }

    return (
        <button className="relative p-2 text-gray-600 hover:text-pasteleria-rosa transition-all active:scale-90 cursor-pointer" onClick={loadItems}>
            <ShoppingCart className={`h-6 w-6 transition-transform ${isAnimate ? 'scale-120 text-pasteleria-rosa' : 'scale-100'}`} />

            {itemCount > 0 && (
                <span
                    className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pasteleria-rosa rounded-full transition-all duration-300 ${isAnimate ? 'scale-125 bg-pink-600' : 'scale-100'
                        }`}
                >
                    {itemCount}
                </span>
            )}
        </button>
        // <Link
        //     href={route('cart.index')}
        //     className="relative p-2 text-gray-600 hover:text-pasteleria-rosa transition-all active:scale-90"
        // >
        //     <ShoppingCart className={`h-6 w-6 transition-transform ${isAnimate ? 'scale-120 text-pasteleria-rosa' : 'scale-100'}`} />

        //     {itemCount > 0 && (
        //         <span className="absolute top-0 right-0 ...">
        //             {itemCount}
        //         </span>
        //     )}
        // </Link>
    );
};