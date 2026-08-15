// import { useState, useEffect } from 'react';
// import { Head, Link } from '@inertiajs/react';
// import MainLayout from '@/layouts/main-layout';
// import { Button } from '@/components/ui/button';
// import { Trash2, ShoppingBasket, ChevronDown, ChevronUp } from 'lucide-react';
// import { GoogleAddressSearch } from '../google-address-search.tsx';



// export default function Cart() {

//     // const DEFAULT_ADDRESS_TEXT = "Retiro en local (Gratis)";
//     // const savedDelieveryInfo = JSON.parse(localStorage.getItem('delivery_info') || '[]');

//     // const updateDeliveryStorage = (data: any) => {
//     //     localStorage.setItem('delivery_info', JSON.stringify(data));
//     // };
//     // const [isDelivery, setIsDelivery] = useState(false); // Switch: false = Retiro, true = Envío
//     // const [deliveryCost, setDeliveryCost] = useState(0);
//     // const [selectedAddress, setSelectedAddress] = useState(null);
//     // const [deliveryDistance, setDeliveryDistance] = useState(null);
//     const DEFAULT_ADDRESS_TEXT = "Retiro en local (Gratis)";

//     // 1. Traemos la info del storage para inicializar los estados
//     const savedDelieveryInfo = JSON.parse(localStorage.getItem('delivery_info') || '{}');

//     // 2. Tu función para actualizar el storage (¡Se queda acá!)
//     const updateDeliveryStorage = (data: any) => {
//         localStorage.setItem('delivery_info', JSON.stringify(data));
//     };

//     // Estados para el envío (inicializados con la data de arriba o valores por defecto)
//     const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//     const [isDelivery, setIsDelivery] = useState(savedDelieveryInfo?.isDelivery ?? false);
//     const [deliveryCost, setDeliveryCost] = useState(savedDelieveryInfo?.cost ?? 0);
//     const [selectedAddress, setSelectedAddress] = useState(savedDelieveryInfo?.address ?? null);
//     const [deliveryDistance, setDeliveryDistance] = useState(savedDelieveryInfo?.distance ?? null);


//     const [cart, setCart] = useState([]);
//     const [openDetails, setOpenDetails] = useState<{ [key: string]: boolean }>({});

//     useEffect(() => {
//         const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');


//         setCart(savedCart);

//         // Por defecto, todos los detalles abiertos al cargar
//         const initialOpenState = {};
//         savedCart.forEach((item: any) => {
//             initialOpenState[item.cartId] = true;
//         });
//         setOpenDetails(initialOpenState);
//     }, []);

//     cart.map((item: any) => {
//         Object.entries(item.selections).map(([attrId, picks]: [string, any]) => (console.log(item.name + ' - picks', picks[0])));
//     });


//     const toggleDetails = (cartId: string) => {
//         setOpenDetails(prev => ({ ...prev, [cartId]: !prev[cartId] }));
//     };

//     const removeFromCart = (cartId: string) => {
//         const newCart = cart.filter((item: any) => item.cartId !== cartId);
//         setCart(newCart);
//         localStorage.setItem('cart', JSON.stringify(newCart));
//         window.dispatchEvent(new Event('cart-updated'));
//     };

//     const totalCart = cart.reduce((acc, item: any) => acc + (item.subtotal * item.quantity), 0);
//     // El total final ahora suma el envío solo si el switch está activo
//     const finalTotal = isDelivery ? totalCart + deliveryCost : totalCart;
//     const COORDENADAS_PASTELERIA = { lat: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_API_HOME_LAT), lng: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_API_HOME_LNG) };

//     const clearDelivery = () => {
//         // localStorage.setItem('delivery_info', JSON.stringify({ isDelivery: false }));
//         // alert('is going to clean');
//         updateDeliveryStorage({
//             isDelivery: false,
//             address: DEFAULT_ADDRESS_TEXT,
//             cost: 0,
//             distance: null,
//             lat: null,
//             lng: null
//         });

//     };


//     const handleAddressSelect = (data) => {

//         // alert('it is for handleAddressSelect');
//         // Si data es null (el usuario limpió el input)

//         if (!data) {
//             setIsDelivery(false);
//             setDeliveryCost(0);
//             setSelectedAddress(null);
//             setDeliveryDistance(null);
//             clearDelivery();

//             return;
//         }


//         console.log("📦 DATOS RECIBIDOS EN EL PADRE:", data);

//         // 1. Definir la ubicación de la Pastelería (Salta Capital)
//         // Ajusta estas coordenadas a la ubicación real del local
//         // const origenPasteleria = { lat: -24.7821, lng: -65.4232 };
//         const origenPasteleria = COORDENADAS_PASTELERIA;
//         // console.log('-----------------------------------------------------', origenPasteleria);

//         // 2. Instanciar el servicio de distancia
//         const service = new google.maps.DistanceMatrixService();

//         service.getDistanceMatrix({
//             origins: [origenPasteleria],
//             destinations: [{ lat: data.lat, lng: data.lng }],
//             travelMode: google.maps.TravelMode.DRIVING,
//             unitSystem: google.maps.UnitSystem.METRIC,
//         }, (response, status) => {

//             console.log("📡 Respuesta Distance Matrix Status:", status);

//             if (status === 'OK' && response) {
//                 const result = response.rows[0].elements[0];

//                 if (result.status === "OK") {
//                     const distanciaTexto = result.distance.text; // Ej: "3.5 km"
//                     // console.log('-----------------------------------------------------', distanciaTexto, 'TravelMode.DRIVING:' + google.maps.TravelMode.DRIVING, ' UnitSystem.METRIC:' + google.maps.UnitSystem.METRIC, 'coordenadas ORIGEN: ', COORDENADAS_PASTELERIA, 'coordenadas: DESTINO', [{ lat: data.lat, lng: data.lng }]);
//                     //alert(distanciaTexto);
//                     const distanciaValor = result.distance.value; // Valor en metros: 3500
//                     const distanciaKm = distanciaValor / 1000;

//                     // console.log(`🚀 LOG 4 (Cálculo): Distancia: ${distanciaTexto} (${distanciaKm} km)`);

//                     // 3. Lógica de Precios de Envío (Ejemplo para Salta)
//                     let costoEnvio = 0;

//                     if (distanciaKm <= 3) {
//                         costoEnvio = 1500;
//                     } else if (distanciaKm <= 6) {
//                         costoEnvio = 2500;
//                     } else {
//                         costoEnvio = 4000;
//                     }

//                     console.log(`💰 Precio calculado para el carrito: $${costoEnvio}`);

//                     setDeliveryCost(costoEnvio);
//                     setSelectedAddress(data.address);
//                     setDeliveryDistance(distanciaTexto);

//                     // Dentro de handleAddressSelect, después de setear los estados:
//                     const deliveryData = {
//                         isDelivery: true,
//                         address: data.address,
//                         cost: costoEnvio,
//                         distance: distanciaTexto,
//                         lat: data.lat,
//                         lng: data.lng
//                     };
//                     updateDeliveryStorage(deliveryData);
//                     // localStorage.setItem('delivery_info', JSON.stringify(deliveryData));

//                 } else {
//                     console.error("No se pudo calcular la ruta:", result.status);
//                     alert("Google no encontró una ruta por calle hasta esa ubicación.");
//                 }
//             } else {
//                 console.error("Error en el servicio Distance Matrix:", status);
//             }
//         });
//     };


//     return (
//         <MainLayout>
//             <Head title="Tu Carrito - Pastelería Díaz" />
//             <div className="container mx-auto p-4 max-w-5xl">
//                 <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800">
//                     <ShoppingBasket className="text-pasteleria-rosa" size={32} /> Mi Pedido
//                 </h1>

//                 {cart.length === 0 ? (
//                     <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//                         <p className="text-gray-400 text-lg mb-6">No hay tortas en el carrito todavía.</p>
//                         <Link href="/">
//                             <Button className="bg-pasteleria-rosa hover:bg-pink-700 px-8 py-6 rounded-full text-lg shadow-lg transition-transform active:scale-95">
//                                 Ver Catálogo de Tortas
//                             </Button>
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//                         {/* LISTA DE ITEMS */}
//                         <div className="lg:col-span-2 space-y-6">
//                             {cart.map((item: any) => (
//                                 < div key={item.cartId} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden" >
//                                     {/* HEADER DEL ITEM */}
//                                     <div className="p-5 flex items-center justify-between bg-neutral-50/50 border-b border-gray-100" >
//                                         <div className="flex-1">
//                                             <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
//                                             <div className="flex gap-4 mt-1 text-sm text-gray-500 font-medium">
//                                                 <span>Cant: <span className="text-gray-900">{item.quantity}</span></span>
//                                                 <span>Precio Unit: <span className="text-gray-900">${new Intl.NumberFormat('es-AR').format(item.subtotal)}</span></span>
//                                             </div>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-xl font-black text-pasteleria-rosa">
//                                                 ${new Intl.NumberFormat('es-AR').format(item.subtotal * item.quantity)}
//                                             </p>
//                                             <button
//                                                 onClick={() => removeFromCart(item.cartId)}
//                                                 className="text-gray-400 hover:text-red-500 transition-colors mt-1 cursor-pointer"
//                                             >
//                                                 <Trash2 size={18} />
//                                             </button>
//                                         </div>
//                                     </div>

//                                     {/* DETALLES DESPLEGABLES */}
//                                     <div className="p-4 border-t border-gray-50">
//                                         <button
//                                             onClick={() => toggleDetails(item.cartId)}
//                                             className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-pasteleria-rosa transition-colors cursor-pointer"
//                                         >
//                                             Detalles {openDetails[item.cartId] ? <ChevronUp className='cursor-pointer' size={14} /> : <ChevronDown className='cursor-pointer' size={14} />}
//                                         </button>

//                                         <div className={`
//                                                 grid transition-all duration-500 ease-in-out overflow-hidden
//                                                 ${openDetails[item.cartId]
//                                                 ? 'grid-rows-[1fr] opacity-100 mt-4'
//                                                 : 'grid-rows-[0fr] opacity-0 mt-0'}
//                                             `}>
//                                             <div className="min-h-0"> {/* Este div es clave para que el efecto funcione */}
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                                     {Object.entries(item.selections).map(([attrId, picks]: [string, any]) => (
//                                                         <div key={attrId} className="bg-pink-50/30 p-3 rounded-xl border border-pink-100/50">
//                                                             <p className="text-[10px] font-bold text-pink-400 uppercase mb-1">
//                                                                 {picks.length > 0 && picks[0].attribute && ` ${picks[0].attribute.name}`}
//                                                             </p>
//                                                             <ul className="space-y-1">
//                                                                 {picks.map((opt: any) => (
//                                                                     <li key={opt.id} className="text-sm text-gray-700 flex justify-between">
//                                                                         <span>{opt.name}</span>
//                                                                         {opt.additional_price > 0 && <span className="text-green-600">+$ {opt.additional_price}</span>}
//                                                                     </li>
//                                                                 ))}
//                                                             </ul>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* RESUMEN FINAL */}
//                         <div className="lg:col-span-1">
//                             <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
//                                 <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Resumen de Pago</h2>

//                                 {/* --- NUEVA SECCIÓN DE ENTREGA --- */}
//                                 <div className="mb-6 space-y-4">
//                                     <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700">
//                                         <span className="text-sm font-medium text-gray-300">¿Envío a domicilio?</span>
//                                         {/* <button
//                                             onClick={() => {
//                                                 setIsDelivery(!isDelivery);
//                                                 if (isDelivery) setDeliveryCost(0); // Reset si apaga el switch
//                                             }}
//                                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDelivery ? 'bg-pasteleria-rosa' : 'bg-gray-600'}`}
//                                         >
//                                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDelivery ? 'translate-x-6' : 'translate-x-1'}`} />
//                                         </button> */}
//                                         <button
//                                             onClick={() => {
//                                                 const nextState = !isDelivery;
//                                                 setIsDelivery(nextState);
//                                                 if (nextState) {
//                                                     setIsAddressModalOpen(true); // Abrimos el modal al activar
//                                                 } else {
//                                                     setDeliveryCost(0);
//                                                     setSelectedAddress(null);
//                                                     clearDelivery();
//                                                 }
//                                             }}
//                                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDelivery ? 'bg-pasteleria-rosa' : 'bg-gray-600'}`}
//                                         >
//                                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDelivery ? 'translate-x-6' : 'translate-x-1'}`} />
//                                         </button>
//                                     </div>

//                                     {/* Mostramos el buscador de Google SOLO si el switch está ON */}
//                                     {isDelivery && (
//                                         <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                                             <p className="text-xs text-gray-400 mb-2">Ingresá tu dirección en Salta:</p>

//                                             {/* <div className="mt-6 p-5 bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pasteleria-rosa shadow-inner">
//                                                 <GoogleAddressSearch onAddressSelect={handleAddressSelect} />

//                                                 {selectedAddress && (
//                                                     <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm">
//                                                         <span className="bg-green-600 text-white p-1 rounded-full text-[10px]">✓</span>
//                                                         Costo de envío calculado:
//                                                         ${deliveryCost}
//                                                         {deliveryDistance && (
//                                                             <span className="text-xs text-gray-500">
//                                                                 ({deliveryDistance})
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 )}

//                                             </div> */}
//                                             {isDelivery && selectedAddress && (


//                                                 <div className="group relative ">
//                                                     <div className="mt-2 p-3 bg-gray-800 rounded-xl border border-gray-700 flex justify-between items-center">
//                                                         {/* <div className="inline-block overflow-hidden"> */}
//                                                         <div className="overflow-hidden cursor-pointer">
//                                                             <p className="text-[10px] text-pasteleria-rosa font-bold uppercase">Destino:</p>
//                                                             <p className="text-xs text-gray-300 truncate">{selectedAddress}</p>

//                                                         </div>

//                                                         <button
//                                                             onClick={() => setIsAddressModalOpen(true)}
//                                                             className="text-[10px] bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 cursor-pointer"
//                                                         >
//                                                             Cambiar
//                                                         </button>
//                                                     </div>
//                                                     <div className="tooltip-green w-full text-left">
//                                                         {selectedAddress}
//                                                         {/* <div className="tooltip-arrow"></div> */}
//                                                     </div>
//                                                 </div>
//                                             )}


//                                         </div>
//                                     )}
//                                 </div>
//                                 {/* --- FIN SECCIÓN ENTREGA --- */}

//                                 <div className="space-y-4 mb-8">
//                                     <div className="flex justify-between text-gray-400">
//                                         <span>Subtotal</span>
//                                         <span>${new Intl.NumberFormat('es-AR').format(totalCart)}</span>
//                                     </div>

//                                     <div className="flex justify-between text-gray-400">
//                                         <span>Envío</span>
//                                         <span className={isDelivery ? "text-white" : "text-green-400"}>
//                                             {isDelivery
//                                                 ? deliveryCost > 0 ? `+$${new Intl.NumberFormat('es-AR').format(deliveryCost)}` : "Calculando..."
//                                                 : DEFAULT_ADDRESS_TEXT /* "Retiro en local (Gratis)" */
//                                             }
//                                         </span>
//                                     </div>

//                                     <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-700 text-pasteleria-rosa">
//                                         <span>Total</span>
//                                         <span>${new Intl.NumberFormat('es-AR').format(finalTotal)}</span>
//                                     </div>
//                                 </div>

//                                 <Link
//                                     href={route('cart.checkout')}
//                                     data={{ isDelivery, deliveryCost, selectedAddress }} // Pasamos los datos al backend/siguiente página
//                                 >
//                                     <Button className="w-full bg-pasteleria-rosa hover:bg-pink-700 text-white font-bold py-8 text-xl rounded-2xl shadow-lg transition-transform active:scale-95">
//                                         Finalizar Pedido
//                                     </Button>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 )
//                 }
//             </div >
//             {/* Modal de Dirección */}
//             {isAddressModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//                     <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200 bg-gradient-to-br from-pink-50 to-white border border-pasteleria-rosa shadow-inner">
//                         <h3 className="text-2xl font-bold text-gray-700 mb-2">¿A dónde enviamos?</h3>
//                         <p className="text-gray-500 mb-6 text-sm">Ingresá tu calle y altura para que calculemos el costo de envío en Salta.</p>

//                         <div className="mt-6 p-5 bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pasteleria-rosa shadow-inner">
//                             <GoogleAddressSearch onAddressSelect={(data) => {
//                                 handleAddressSelect(data);
//                                 // if (data) setIsAddressModalOpen(false); // Cerramos al seleccionar
//                             }} />
//                             {/* Feedback de precio en tiempo real */}
//                             {selectedAddress && (
//                                 <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm">
//                                     <span className="bg-green-600 text-white p-1 rounded-full text-[10px]">✓</span>
//                                     Costo de envío calculado:
//                                     ${deliveryCost}
//                                     {deliveryDistance && (
//                                         <span className="text-xs text-gray-500">
//                                             ({deliveryDistance})
//                                         </span>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         <button
//                             onClick={() => {
//                                 setIsAddressModalOpen(false);
//                                 if (!selectedAddress) setIsDelivery(false); // Si cancela sin elegir, apagamos el switch
//                             }}
//                             // className="mt-6 w-full py-3 text-gray-400 hover:text-gray-600 font-medium transition-colors"
//                             className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md"
//                         >
//                             Aceptar
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </MainLayout >
//     );
// }


import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBasket, ChevronDown, ChevronUp, X } from 'lucide-react';
// import { GoogleAddressSearch } from '../google-address-search.tsx';
import { GoogleAddressSearchMap } from '../google-address-search-map.tsx';

// 1. Definimos una estructura limpia para los datos de entrega
interface DeliveryInfo {
    isDelivery: boolean;
    address: string | null;
    cost: number;
    distance: string | null;
    lat: number | null;
    lng: number | null;
}

const DEFAULT_DELIVERY: DeliveryInfo = {
    isDelivery: false,
    address: "Retiro en local (Gratis)",
    cost: 0,
    distance: null,
    lat: null,
    lng: null
};

export default function Cart({ deliveryRates = [] }) {
    console.log('------------------------#############', deliveryRates);
    // const DEFAULT_ADDRESS_TEXT = "Retiro en local (Gratis)";
    const COORDENADAS_PASTELERIA = {
        lat: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_API_HOME_LAT),
        lng: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_API_HOME_LNG)
    };

    // 2. Estado unificado de entrega (inicializado perezosamente desde localStorage)
    const [delivery, setDelivery] = useState<DeliveryInfo>(() => {
        try {
            // Limpiar cualquier basura en localStorage primero
            const saved = localStorage.getItem('delivery_info');

            // Si está vacío, null, o es la string "null", resetear
            if (!saved || saved === 'null' || saved === '') {
                const jsonString = JSON.stringify(DEFAULT_DELIVERY);
                localStorage.setItem('delivery_info', jsonString);

                return DEFAULT_DELIVERY;
            }

            const parsed = JSON.parse(saved);

            // Asegurar que tenga la estructura correcta y completar con defaults
            return { ...DEFAULT_DELIVERY, ...parsed };
        } catch (error) {
            console.error('Error al parsear delivery_info del localStorage:', error);
            localStorage.removeItem('delivery_info');
            const jsonString = JSON.stringify(DEFAULT_DELIVERY);
            localStorage.setItem('delivery_info', jsonString);

            return DEFAULT_DELIVERY;
        }
    });

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [openDetails, setOpenDetails] = useState<{ [key: string]: boolean }>({});

    // Función centralizada para actualizar estado y localStorage al mismo tiempo
    const updateDelivery = (newData: Partial<DeliveryInfo>) => {
        setDelivery(prev => {
            const updated = { ...prev, ...newData };
            localStorage.setItem('delivery_info', JSON.stringify(updated));
            return updated;
        });
    };

    // Carga inicial del carrito
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);

        const initialOpenState = {};
        savedCart.forEach((item: any) => {
            initialOpenState[item.cartId] = true;
        });
        setOpenDetails(initialOpenState);
    }, []);

    const toggleDetails = (cartId: string) => {
        setOpenDetails(prev => ({ ...prev, [cartId]: !prev[cartId] }));
    };

    const removeFromCart = (cartId: string) => {
        const newCart = cart.filter((item: any) => item.cartId !== cartId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart-updated'));
    };

    // Cálculos de totales utilizando el estado unificado
    const totalCart = cart.reduce((acc, item: any) => acc + (item.subtotal * item.quantity), 0);
    const finalTotal = delivery.isDelivery ? totalCart + delivery.cost : totalCart;

    // Handler para el switch de envío
    const handleDeliveryToggle = () => {
        // const nextState = !delivery.isDelivery;

        // if (nextState) {
        //     setIsAddressModalOpen(true);
        //     updateDelivery({ isDelivery: true });
        // } else {
        //     // Si desactiva, limpiamos todo de golpe tanto en React como en LocalStorage
        //     updateDelivery(DEFAULT_DELIVERY);
        // }
        if (!isDelivery) {
            // El usuario quiere envío -> Solo abrimos el modal, NO guardamos nada todavía
            setIsAddressModalOpen(true);
        } else {
            // El usuario apaga el envío -> Volvemos a retiro en local de inmediato
            setIsDelivery(false);
            // setDeliveryCost(0);
            // setSelectedAddress(null);
            updateDelivery(DEFAULT_DELIVERY);

            // Guardamos el reset definitivo
            // localStorage.setItem('delivery_info', JSON.stringify({
            //     isDelivery: false,
            //     address: 'Retiro en Sucursal'
            // }));
        }
    };

    // Lógica de Google Maps Distance Matrix
    const handleAddressSelect = (data) => {
        console.log('------------------------ > data', data);
        // alert('se esta por modificar la data del delivery');

        if (!data) {
            alert('no se puede conectar con los servidores de google.');
            updateDelivery(DEFAULT_DELIVERY);

            return;
        }

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [COORDENADAS_PASTELERIA],
            destinations: [{ lat: data.lat, lng: data.lng }],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        }, (response, status) => {
            if (status === 'OK' && response) {
                console.log('------------------------', deliveryRates);
                const result = response.rows[0].elements[0];

                if (result.status === "OK") {
                    const distanciaTexto = result.distance.text;
                    const distanciaValor = result.distance.value; // metros
                    const distanciaKm = result.distance.value / 1000;

                    // --- LÓGICA SENIOR DINÁMICA ---
                    // Buscamos la primera tarifa que cubra esta distancia
                    const tarifaCorrespondiente = deliveryRates.find(
                        (rate: any) => distanciaKm <= rate.max_distance_km
                    );


                    let costoEnvio = 0;
                    // if (distanciaKm <= 3) costoEnvio = 1500;
                    // else if (distanciaKm <= 6) costoEnvio = 2500;
                    // else costoEnvio = 4000;

                    // if (tarifaCorrespondiente) {
                    //     costoEnvio = tarifaCorrespondiente.price;
                    // } else if (deliveryRates.length > 0) {
                    //     // Fallback: Si supera el km máximo, toma el último elemento cargado
                    //     costoEnvio = deliveryRates[deliveryRates.length - 1].price;
                    // } else {
                    //     // Fallback absoluto por si la tabla de la BD está vacía
                    //     costoEnvio = 2500;
                    // }
                    if (tarifaCorrespondiente) {
                        costoEnvio = tarifaCorrespondiente.price;
                    } else {
                        // si no hay tarifa que cubra la distancia no se deberia permitir el envío y resetear a retiro en local
                        alert("Lo sentimos, tu ubicación supera el rango máximo de envío. Por favor, elige retiro en local.");
                        updateDelivery(DEFAULT_DELIVERY);

                        return;
                    }


                    // Actualizamos todo el paquete de datos juntos
                    updateDelivery({
                        isDelivery: true,
                        address: data.address,
                        cost: costoEnvio,
                        distance: distanciaTexto,
                        lat: data.lat,
                        lng: data.lng
                    });
                } else {
                    alert("Google no encontró una ruta por calle hasta esa ubicación.");
                }
            }
        });
    };

    // Al cargar el componente, leemos cómo estaba el storage para inicializar la pantalla
    const [isDelivery, setIsDelivery] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('delivery_info') || '{}');
        return saved.isDelivery || false; // Si estaba en true, el switch arranca activo
    });




    return (
        <MainLayout>
            <Head title="Tu Carrito - Pastelería Díaz" />
            <div className="container mx-auto p-4 max-w-5xl">
                <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800">
                    <ShoppingBasket className="text-pasteleria-rosa" size={32} /> Mi Pedido
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-lg mb-6">No hay tortas en el carrito todavía.</p>
                        <Link href={route('catalog.index')}>
                            <Button className="bg-pasteleria-rosa hover:bg-pink-700 px-8 py-6 rounded-full text-lg shadow-lg">
                                Ver Catálogo de Tortas
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* LISTA DE ITEMS */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item: any) => (
                                <div key={item.cartId} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden" >
                                    <div className="p-5 flex items-center justify-between bg-neutral-50/50 border-b border-gray-100" >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                                            <div className="flex gap-4 mt-1 text-sm text-gray-500 font-medium">
                                                <span>Cant: <span className="text-gray-900">{item.quantity}</span></span>
                                                <span>Precio x Unidad: <span className="text-gray-900">${new Intl.NumberFormat('es-AR').format(item.subtotal)}</span></span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-pasteleria-rosa">
                                                ${new Intl.NumberFormat('es-AR').format(item.subtotal * item.quantity)}
                                            </p>
                                            <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 transition-colors mt-1 cursor-pointer">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-gray-50">
                                        <button onClick={() => toggleDetails(item.cartId)} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-pasteleria-rosa transition-colors cursor-pointer">
                                            Detalles {openDetails[item.cartId] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                        <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${openDetails[item.cartId] ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                            <div className="min-h-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {Object.entries(item.selections).map(([attrId, picks]: [string, any]) => (
                                                        <div key={attrId} className="bg-pink-50/30 p-3 rounded-xl border border-pink-100/50">
                                                            <p className="text-[10px] font-bold text-pink-400 uppercase mb-1">
                                                                {picks.length > 0 && picks[0].attribute && ` ${picks[0].attribute.name}`}
                                                            </p>
                                                            <ul className="space-y-1">
                                                                {picks.map((opt: any) => (
                                                                    <li key={opt.id} className="text-sm text-gray-700 flex justify-between">
                                                                        <span>{opt.name}</span>
                                                                        {opt.additional_price > 0 && <span className="text-green-600">+$ {opt.additional_price}</span>}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RESUMEN FINAL */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
                                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Resumen de Pago</h2>

                                <div className="mb-6 space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                                        <span className="text-sm font-medium text-gray-300">¿Envío a domicilio?</span>
                                        <button
                                            onClick={handleDeliveryToggle}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${delivery.isDelivery ? 'bg-pasteleria-rosa' : 'bg-gray-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${delivery.isDelivery ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {delivery.isDelivery && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <p className="text-xs text-gray-400 mb-2">Ingresá tu dirección en Salta:</p>
                                            {delivery.address && (
                                                <div className="group relative">
                                                    <div className="mt-2 p-3 bg-gray-800 rounded-xl border border-gray-700 flex justify-between items-center">
                                                        <div className="overflow-hidden cursor-pointer">
                                                            <p className="text-[10px] text-pasteleria-rosa font-bold uppercase">Destino:</p>
                                                            <p className="text-xs text-gray-300 truncate">{delivery.address}</p>
                                                        </div>
                                                        <button onClick={() => setIsAddressModalOpen(true)} className="text-[10px] bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 cursor-pointer">
                                                            Cambiar
                                                        </button>
                                                    </div>
                                                    <div className="tooltip-green w-full text-left">
                                                        {delivery.address}
                                                        {/* <div className="tooltip-arrow"></div> */}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${new Intl.NumberFormat('es-AR').format(totalCart)}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-400">
                                        <span>Envío</span>
                                        <span className={delivery.isDelivery ? "text-white" : "text-green-400"}>
                                            {delivery.isDelivery
                                                ? delivery.cost > 0 ? `+$${new Intl.NumberFormat('es-AR').format(delivery.cost)}` : "Calculando..."
                                                : DEFAULT_DELIVERY.address
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-700 text-pasteleria-rosa">
                                        <span>Total</span>
                                        <span>${new Intl.NumberFormat('es-AR').format(finalTotal)}</span>
                                    </div>
                                </div>

                                {/* Enviamos directo el objeto delivery estructurado */}
                                <Link
                                    href={route('cart.checkout')}
                                    data={{ delivery }}
                                >
                                    <Button className="w-full bg-pasteleria-rosa hover:bg-pink-700 text-white font-bold py-8 text-xl rounded-2xl shadow-lg transition-transform active:scale-95">
                                        Finalizar Pedido
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Dirección */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl bg-gradient-to-br from-pink-50 to-white border border-pasteleria-rosa">

                        <button onClick={() => setIsAddressModalOpen(false)} aria-label="Cerrar" className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-600" >
                            <X size={18} />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-700 mb-2">¿A dónde enviamos?</h3>
                        <p className="text-gray-500 mb-6 text-sm">Ingresá tu calle y altura para que calculemos el costo de envío en Salta.</p>

                        <div className="mt-6 p-5 bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pasteleria-rosa shadow-inner">
                            {/* <GoogleAddressSearch onAddressSelect={handleAddressSelect} /> */}
                            <GoogleAddressSearchMap
                                onAddressSelect={handleAddressSelect}
                                initialCoordinates={
                                    delivery && delivery.isDelivery
                                        ? { lat: delivery.lat, lng: delivery.lng }
                                        : undefined
                                } />

                            {delivery.address && (
                                <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <span className="bg-green-600 text-white p-1 rounded-full text-[10px]">✓</span>
                                    Costo de envío calculado: ${delivery.cost}
                                    {delivery.distance && <span className="text-xs text-gray-500">({delivery.distance})</span>}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setIsAddressModalOpen(false);
                                if (!delivery.isDelivery) updateDelivery(DEFAULT_DELIVERY);
                            }}
                            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}