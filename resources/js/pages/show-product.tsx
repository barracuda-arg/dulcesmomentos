import { Head, Link } from '@inertiajs/react';
import { router } from "@inertiajs/react";
import { ChevronLeft, ShoppingBag, CircleMinus, PlusCircle, MinusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { SafeHtml } from '@/components/safe-html';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';
import { ImageZoom } from './zoom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { set } from 'zod';
import { QuantitySelector } from './quntity-selector';
import { isValid } from 'zod/v3';
import { FormLabel } from '@/components/ui/form';
import { pick } from 'node_modules/zod/v4/core/util.cjs';
import { GoogleAddressSearch } from './google-address-search.tsx';
import { cn } from '@/lib/utils';

export default function Show({ product, stepsObj, initialSelections }) {


    // 1. Constantes de negocio
    const ENVIO_DOMICILIO_ID = 26; // El ID de tu DB
    const COORDENADAS_PASTELERIA = { lat: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_API_HOME_LAT), lng: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_API_HOME_LNG) };

    const steps = stepsObj['data'] || []; // Aseguramos que steps sea un array, incluso si data no existe
    // console.log('------------->', steps);


    // console.log('Initial Selections in Show:', initialSelections); // Verificamos qué llega a Show

    const customizations = steps.filter(c => c.step_number !== 0);

    console.log('Customizations en Show:', customizations); // Verificamos qué llega a Show


    // console.log('Customizations:', customizations); // Verificamos qué llega en customizations

    // 1. Agregá esta línea que faltaba:
    const [currentStep, setCurrentStep] = useState(0);

    // const [selections, setSelections] = useState({}); // { attr_id: [opt1, opt2] }
    const [selections, setSelections] = useState(initialSelections || {});

    // const activeAttr = customizations[currentStep];

    // 3. Función para calcular el total adicional
    console.log('Calculating total with selections:', selections);
    const calculateTotal = () => {
        let extra = 0;
        let quantity = selectedQuantity || 1; // Usamos el estado de cantidad seleccionado
        Object.values(selections).flat().forEach((opt: any) => {
            console.log('Calculating price, option:', opt);
            // Aquí puedes decidir:
            // a) Si la opción ya era "default", el precio es 0.
            // b) Si quieres cobrar el precio que diga la opción siempre.
            extra += parseFloat(opt.additional_price || 0);
        }); `{selectedOrder.notes || 'Sin notas adicionales'}`

        return selectedQuantity * extra;
    };


    // const handleDistanceCalculation = (addressData) => {
    //     const distanceService = new google.maps.DistanceMatrixService();

    //     distanceService.getDistanceMatrix({
    //         origins: [UBI_PASTELERIA],
    //         destinations: [{ lat: addressData.lat, lng: addressData.lng }],
    //         travelMode: google.maps.TravelMode.DRIVING,
    //     }, (response, status) => {
    //         if (status === 'OK') {
    //             const distanceInKm = response.rows[0].elements[0].distance.value / 1000;
    //             setDistance(distanceInKm);

    //             // Lógica de costos de Salta
    //             let extraPrice = 1500; // Base hasta 3km
    //             if (distanceInKm > 3 && distanceInKm <= 7) extraPrice = 2500;
    //             if (distanceInKm > 7) extraPrice = 4000;

    //             // ACTUALIZAMOS LA SELECCIÓN:
    //             // Esto es vital: actualizamos el 'additional_price' de la opción en el estado
    //             // para que el total de la torta se recalcule solo.
    //             setSelections(prev => {
    //                 const currentEnvio = prev[activeAttr.id].map(opt =>
    //                     opt.id === ENVIO_DOMICILIO_ID
    //                         ? { ...opt, additional_price: extraPrice, address: addressData.label }
    //                         : opt
    //                 );
    //                 return { ...prev, [activeAttr.id]: currentEnvio };
    //             });
    //         }
    //     });
    // };

    // 2. Dentro de tu componente principal de Torta
    // const handleAddressSelect = (data) => {
    //     const service = new google.maps.DistanceMatrixService();

    //     service.getDistanceMatrix({
    //         origins: [COORDENADAS_PASTELERIA],
    //         destinations: [{ lat: data.lat, lng: data.lng }],
    //         travelMode: google.maps.TravelMode.DRIVING,
    //     }, (result, status) => {
    //         if (status === 'OK' && result) {
    //             const distanceKm = result.rows[0].elements[0].distance.value / 1000;

    //             // Lógica de costos (ajustá los precios a tu necesidad)
    //             let cost = 1500;

    //             if (distanceKm > 3) {
    //                 cost = 2500;
    //             }

    //             if (distanceKm > 8) {
    //                 cost = 4000;
    //             }

    //             // Actualizamos la opción de envío en las selecciones
    //             setSelections(prev => {
    //                 const currentEnvio = prev[activeAttr.id].map(opt =>
    //                     opt.id === ENVIO_DOMICILIO_ID
    //                         ? { ...opt, additional_price: cost, calculated_address: data.address }
    //                         : opt
    //                 );
    //                 return { ...prev, [activeAttr.id]: currentEnvio };
    //             });
    //         }
    //     });
    // };

    // const handleAddressSelect = (data) => {
    //     console.log("Calculando distancia para:", data.address);

    //     const service = new google.maps.DistanceMatrixService();

    //     service.getDistanceMatrix({
    //         origins: [{ lat: -24.7821, lng: -65.4232 }], // Coordenadas de la pastelería
    //         destinations: [{ lat: data.lat, lng: data.lng }],
    //         travelMode: google.maps.TravelMode.DRIVING,
    //     }, (result, status) => {
    //         if (status === 'OK' && result) {
    //             const element = result.rows[0].elements[0];

    //             if (element.status === "ZERO_RESULTS") {
    //                 alert("No se pudo calcular la ruta. ¿La dirección es correcta?");
    //                 return;
    //             }

    //             const distanceKm = element.distance.value / 1000;
    //             console.log("Distancia obtenida:", distanceKm);

    //             // ACTUALIZACIÓN DE PRECIO (Lógica de Salta)
    //             let cost = 1500;
    //             if (distanceKm > 3) cost = 2500;
    //             if (distanceKm > 8) cost = 4000;

    //             // Actualizamos las selecciones para que el carrito se entere
    //             setSelections(prev => {
    //                 const currentEnvio = prev[activeAttr.id].map(opt =>
    //                     opt.id === ENVIO_DOMICILIO_ID
    //                         ? { ...opt, additional_price: cost, address_detail: data.address }
    //                         : opt
    //                 );
    //                 return { ...prev, [activeAttr.id]: currentEnvio };
    //             });
    //         } else {
    //             console.error("Error con Distance Matrix:", status);
    //         }
    //     });
    // };
    const handleAddressSelect = (data) => {

        // Si data es null (el usuario limpió el input)
        if (!data) {
            setSelections(prev => {
                const resetEnvio = prev[activeAttr.id].map(opt =>
                    opt.id === ENVIO_DOMICILIO_ID
                        ? { ...opt, additional_price: 0, calculated_address: null, distance_text: null }
                        : opt
                );
                return { ...prev, [activeAttr.id]: resetEnvio };
            });
            return;
        }


        console.log("📦 DATOS RECIBIDOS EN EL PADRE:", data);

        // 1. Definir la ubicación de la Pastelería (Salta Capital)
        // Ajusta estas coordenadas a la ubicación real del local
        // const origenPasteleria = { lat: -24.7821, lng: -65.4232 };
        const origenPasteleria = COORDENADAS_PASTELERIA;
        // console.log('-----------------------------------------------------', origenPasteleria);

        // 2. Instanciar el servicio de distancia
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [origenPasteleria],
            destinations: [{ lat: data.lat, lng: data.lng }],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        }, (response, status) => {

            console.log("📡 Respuesta Distance Matrix Status:", status);

            if (status === 'OK' && response) {
                const result = response.rows[0].elements[0];

                if (result.status === "OK") {
                    const distanciaTexto = result.distance.text; // Ej: "3.5 km"
                    console.log('-----------------------------------------------------', distanciaTexto, 'TravelMode.DRIVING:' + google.maps.TravelMode.DRIVING, ' UnitSystem.METRIC:' + google.maps.UnitSystem.METRIC, 'coordenadas ORIGEN: ', COORDENADAS_PASTELERIA, 'coordenadas: DESTINO', [{ lat: data.lat, lng: data.lng }]);
                    alert(distanciaTexto);
                    const distanciaValor = result.distance.value; // Valor en metros: 3500
                    const distanciaKm = distanciaValor / 1000;

                    console.log(`🚀 LOG 4 (Cálculo): Distancia: ${distanciaTexto} (${distanciaKm} km)`);

                    // 3. Lógica de Precios de Envío (Ejemplo para Salta)
                    let costoEnvio = 0;
                    if (distanciaKm <= 3) {
                        costoEnvio = 1500;
                    } else if (distanciaKm <= 6) {
                        costoEnvio = 2500;
                    } else {
                        costoEnvio = 4000;
                    }

                    console.log(`💰 Precio calculado para el carrito: $${costoEnvio}`);

                    // 4. Actualizar el estado de tus selecciones
                    // Buscamos el atributo 'ENVIO' y actualizamos la opción 'Envío a Domicilio'
                    setSelections(prev => {
                        const currentEnvioAttr = prev[activeAttr.id].map(opt => {
                            if (opt.id === ENVIO_DOMICILIO_ID) {
                                return {
                                    ...opt,
                                    additional_price: costoEnvio,
                                    calculated_address: data.address,
                                    distance_text: distanciaTexto
                                };
                            }
                            return opt;
                        });
                        return { ...prev, [activeAttr.id]: currentEnvioAttr };
                    });

                } else {
                    console.error("No se pudo calcular la ruta:", result.status);
                    alert("Google no encontró una ruta por calle hasta esa ubicación.");
                }
            } else {
                console.error("Error en el servicio Distance Matrix:", status);
            }
        });
    };
    const handleOptionClick = (option) => {


        console.log('======================== Option clicked:', option, 'Active Attribute:', activeAttr);
        const attrId = activeAttr.id;

        //const attrName = activeAttr.name; // 20260427
        // attrId = attrName;
        const currentPicks = selections[attrId] || [];
        const isAlreadySelected = currentPicks.some(item => item.id === option.id);
        // console.log('attribute=============>>>>>>>>', option, activeAttr);

        if (!Object.hasOwn(option, 'attribute')) {
            // Only store serializable properties needed for cart display
            option.attribute = {
                id: activeAttr.id,
                name: activeAttr.name,
                is_multiple: activeAttr.is_multiple,
                step_number: activeAttr.step_number
            };
            //console.log('option after assigning attribute reference:', option);
            //  alert('No tiene attribute, se lo asigno ahora' + option.attribute.name);
        } else {
            // console.log('option WITHOUT assigning attribute reference:', option);
            // alert('option already has attribute reference:' + option.attribute.name);
        }

        // console.log('option with attribute reference:', option);

        // alert('se va a agregar el option');

        // 1. SI YA ESTÁ SELECCIONADA: La removemos (Toggle Off)
        if (isAlreadySelected) {
            setSelections({
                ...selections,
                [attrId]: currentPicks.filter(item => item.id !== option.id)
            });
            return; // Salimos de la función aquí
        }

        // Creamos una copia limpia para el carrito
        const cleanOption = {
            ...option,
            // Usamos URL() para extraer solo el path si viene con el dominio
            image: option.image ? option.image.replace(`${window.location.origin}/`, '') : null
        };

        // 2. SI NO ESTÁ SELECCIONADA: La agregamos (Toggle On)
        if (activeAttr.is_multiple) {
            // Modo Múltiple: Agregamos al array existente

            setSelections({
                ...selections,
                // [attrId]: [...currentPicks, option]
                [attrId]: [...currentPicks, cleanOption]
            });
        } else {
            // Modo Único: Reemplazamos lo que haya por la nueva opción
            setSelections({
                ...selections,
                // [attrId]: [option]
                [attrId]: [cleanOption]

            });
        }



    };
    const removeOption = (attrId, optionId) => {
        setSelections({
            ...selections,
            [attrId]: selections[attrId].filter(opt => opt.id !== optionId)
        });
    };


    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [activeAttr, setActiveAttr] = useState(customizations[0] || null);

    // const openStepConfig = (index: number) => {
    //     const activeAttribute = customizations.find(s => s.id === index) || null;
    //     setActiveAttr(activeAttribute);
    //     setCurrentStep(activeAttribute.step_number); // Aseguramos que el paso activo se sincronice con el índice del atributo
    //     setActiveStepIndex(index);
    //     setIsConfigModalOpen(true);
    // };
    //////////////fin //////////////////////////////////////////////////////


    const openStepConfig = (attrId: number) => {
        const selectedAttr = customizations.find(a => a.id === attrId);

        if (selectedAttr) {
            setActiveAttr(selectedAttr);
            setCurrentStep(selectedAttr.step_number);
            setIsConfigModalOpen(true);
        }
    };

    // Dentro de tu componente Show

    // Buscamos el siguiente atributo basado en el step_number actual
    const handleNextStep = () => {
        // Buscamos el primer atributo cuyo step_number sea mayor al actual
        const nextAttr = customizations
            .sort((a, b) => a.step_number - b.step_number)
            .find(attr => attr.step_number > activeAttr.step_number);

        if (nextAttr) {
            setActiveAttr(nextAttr);
            setCurrentStep(nextAttr.step_number);
        }
    };

    const handlePrevStep = () => {
        // Buscamos los atributos menores al actual, los ordenamos de mayor a menor y tomamos el primero
        const prevAttr = customizations
            .filter(attr => attr.step_number < activeAttr.step_number)
            .sort((a, b) => b.step_number - a.step_number)[0];

        if (prevAttr) {
            setActiveAttr(prevAttr);
            setCurrentStep(prevAttr.step_number);
        }
    };
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const [invalidAttributes, setInvalidAttributes] = useState<string[]>([]);

    // const hasEnvioDomicilio = (attr) => {
    //     const ret = false;
    //     attr.options.map((opt) => {
    //         if (opt.id === ENVIO_DOMICILIO_ID) {
    //             ret = true;
    //         }
    //     });
    //     return ret;
    // }

    const handleValidation = () => {
        const invalid = customizations
            // .filter(attr => attr.is_required && (!selections[attr.id] || selections[attr.id].length === 0))
            .filter((attr) => {
                // let domicilioEntregaValido = true;
                let isInvalid = attr.is_required && (!selections[attr.id] || selections[attr.id].length === 0);
                //console.log('!!!!!!!!!!!', attr);
                // console.log('###########', selections)
                // Averiguar si el attributo tiene la opcion de envio a domicilio

                attr.options.map((opt) => {

                    if (opt.id === ENVIO_DOMICILIO_ID && !isInvalid) {
                        isInvalid = false;
                        // console.log('??????????????', selections[2]);
                        // alert(domicilioEntregaValido);
                        const objEntrega = selections[attr.id][0]
                        // console.log('&&&&&&&&&&&&&&&&', objEntrega);

                        if (objEntrega.id === ENVIO_DOMICILIO_ID) {
                            // alert('es envio a domicilio');
                            isInvalid = !(parseFloat(objEntrega.additional_price) > 0);
                        }
                    }
                })


                return isInvalid;
            })
            .map(attr => attr.id)

        setInvalidAttributes(invalid);
    };


    const addToCart = (finishNow = false) => {

        console.log('Adding to cart with selections:', selections, 'and quantity:', selectedQuantity, 'and product:', product, 'and customizations:', customizations);
        const isValid = customizations.every(attr => {
            if (attr.is_required) {
                const picks = selections[attr.id] || [];

                // if (picks.length === 0) {
                //     console.log(`La personalización "${attr.name}" es requerida pero no tiene selecciones.`);

                // }
                handleValidation();


                return picks.length > 0; // Si es requerido, debe tener al menos una selección
            }
            return true; // Si no es requerido, no importa si tiene selección o no
        });

        if (!isValid) {
            toast.error("Por favor completa todas las personalizaciones requeridas antes de agregar al carrito.");
            return;
        }

        console.log(product.default_options);
        // 1. Preparamos el objeto del item
        const cartItem = {
            cartId: Date.now().toString(), // Generamos un ID único temporal
            product_id: product.id,
            name: product.name,
            image: product.image,
            price_at_purchase: calculateTotal(),
            quantity: selectedQuantity,
            subtotal: calculateTotal(), // Por ahora el subtotal es igual al precio, pero si luego querés agregar cantidad, ahí se diferencia
            selections: selections // Guardamos el objeto de selecciones para mostrarlo luego en el carrito y en el resumen del pedido
        };

        // 2. Obtenemos lo que ya hay en LocalStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

        const existingItemIndex = existingCart.findIndex(item => item.product_id === cartItem.product_id);

        if (existingItemIndex !== -1) {
            return toast.error("Ya agregaste esta torta al carrito. Si querés cambiar la personalización, por favor eliminá el item del carrito y agregalo de nuevo.");
        }

        // 3. Guardamos el nuevo item
        const newCart = [...existingCart, cartItem];


        localStorage.setItem('cart', JSON.stringify(newCart));

        toast.success("¡Torta agregada al carrito!");
        // DISPARAR ESTO después de guardar en localStorage:
        window.dispatchEvent(new Event('cart-updated'));

        if (finishNow) {
            // router.get(route('cart.checkout')); // Mandamos al formulario de entrega
            router.get(route('cart.index'));
        } else {
            router.get(route('home')); // Mandamos al catálogo para que elija otra
        }
    };

    return (
        <MainLayout>
            <Head title="Ver Producto" />

            <div className="min-h-screen bg-white pb-12">
                <Head title={product.name} />

                {/* Header / Nav de retorno */}
                <div className="container mx-auto p-4">
                    <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-pink-600 transition-colors">
                        <ChevronLeft className="size-4" /> Volver al catálogo
                    </Link>
                </div>


                <main className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-4">
                    {/* columna izquierda: imagen del producto */}
                    <div className="flex flex-col gap-4">
                        <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-inner">
                            <ImageZoom
                                src={`${product.image?.includes('demo') ? product.image : `/storage/${product.image}`}`}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 cursor-pointer"
                            />
                        </div>
                        <div className="py-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>

                            <SafeHtml html={product.description} />
                        </div>
                    </div>

                    {/* columna derecha: detalles del producto y botón de pedido */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold text-pink-600 mt-2">
                                {/* ${new Intl.NumberFormat('es-AR').format(product.price)} */}
                                $ {calculateTotal().toLocaleString('es-AR')}
                            </p>
                        </div>
                        {/* --- RESUMEN DE ARMADO --- */}

                        <div className="bg-neutral-50 rounded-2xl p-6 border border-dashed border-neutral-300 text-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                                Resumen de tu Pedido
                            </h3>

                            <div className="space-y-4">
                                {console.log('vamos el index=======>', customizations)}
                                {customizations.map((attr) => {
                                    const picks = selections[attr.id] || [];
                                    const isInvalid = invalidAttributes.includes(attr.id);

                                    return (
                                        <div key={attr.id} className={cn(
                                            'flex flex-col border-b border-neutral-200 pb-2 last:border-0',
                                            isInvalid && 'bg-pink-100 animate-pulse border-pink-200 rounded-lg'
                                        )}>
                                            <div className="flex items-center mb-2 ">
                                                <p>
                                                    {!!attr.is_required && (
                                                        <div className="group relative inline-block">
                                                            <div className="flex items-center lowercase cursor-pointer">
                                                                <span className={`ml-1 text-xs ${isInvalid ? 'text-red-600 font-bold animate-pulse' : 'hidden'}`}>
                                                                    (*) &nbsp;
                                                                </span>
                                                            </div>
                                                            <div className="tooltip-rosa w-48 text-left">
                                                                Requerido: Debe elegir al menos una opcion para <span className='uppercase'>{attr.name}</span>
                                                                <div className="tooltip-arrow"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{attr.name} </span>
                                                </p>
                                                {/* Botón MÁS para abrir el modal en este paso específico */}







                                                <button
                                                    onClick={() => openStepConfig(attr.id)}
                                                    className="text-pasteleria-rosa hover:bg-pink-50 p-1 rounded-full transition-colors cursor-pointer ml-1"
                                                >
                                                    <PlusCircle size={18} />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {picks.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center justify-between w-full ">
                                                        <span className="text-sm text-gray-700">
                                                            {opt.name}
                                                        </span>
                                                        <p>
                                                            <span className="text-sm font-mono text-neutral-500">
                                                                {opt.additional_price > 0 ? `+$${opt.additional_price}` : 'Incluido'}
                                                            </span>
                                                            {/* Botón MENOS para remover */}
                                                            <button
                                                                onClick={() => removeOption(attr.id, opt.id)}
                                                                className="text-pasteleria-rosa hover:bg-pink-50 p-1 rounded-full transition-colors cursor-pointer ml-1"
                                                            >
                                                                <MinusCircle size={16} />
                                                            </button>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-4 border-t-2 border-gray-800 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500">Precio Final</p>
                                    <p className="text-2xl font-black text-pasteleria-rosa">
                                        $ {calculateTotal().toLocaleString('es-AR')}
                                    </p>
                                </div>
                                <QuantitySelector
                                    min={1}
                                    max={10} // Podrías pasar el stock real aquí
                                    onChange={(val) => setSelectedQuantity(val)}
                                />
                                {/* <Button className="bg-gray-900 text-white">Comprar Ahora</Button> */}
                            </div>
                        </div>

                        <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
                            <DialogContent className="max-w-2xl"
                                onInteractOutside={(e) => {
                                    // Si el clic ocurrió en la lista de Google, evitamos que el modal se cierre
                                    const classes = (e.target as HTMLElement).classList;

                                    if (
                                        e.target instanceof HTMLElement && (
                                            e.target.closest('.pac-container') ||
                                            classes.contains('pac-item') ||
                                            classes.contains('pac-item-query')
                                        )) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <DialogHeader>
                                    {/* <DialogTitle>Personalizar {activeAttr?.name}</DialogTitle> */}
                                    <DialogTitle>Personalice su Torta</DialogTitle>
                                </DialogHeader>
                                {/* CONFIGURADOR */}
                                <div className="w-full max-w-4xl mx-auto">
                                    {/* Si el producto es customizable, mostramos el configurador */}
                                    {product.is_customizable && activeAttr && (
                                        <div className="mt-2 border p-6 rounded-2xl bg-white shadow-sm">

                                            {/* Título del Paso Dinámico */}
                                            <h2 className="text-xl font-semibold mb-4 text-pasteleria-rosa">
                                                Paso {currentStep}: {activeAttr.name}
                                            </h2>

                                            {/* Grilla de Opciones */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {activeAttr.options.map((opt) => {
                                                    console.log('******************:', opt);
                                                    const isSelected = selections[activeAttr.id]?.some(s => s.id === opt.id);

                                                    return (
                                                        <div
                                                            key={opt.id}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${isSelected
                                                                ? 'border-pasteleria-rosa bg-pink-50' /* opacity-60' */
                                                                : 'border-gray-100 hover:border-pink-200'
                                                                }`}
                                                        >
                                                            {opt.image && (
                                                                < img src={`${opt.image}`} className="w-full h-20 object-cover rounded-lg mb-2" />
                                                            )}
                                                            <p className="font-medium text-center text-sm">{opt.name}</p>
                                                            <p className="text-xs text-green-600 text-center">+ ${opt.additional_price}</p>

                                                        </div>
                                                    );
                                                })}
                                            </div>


                                            {/* Dentro de tu mapeo de opciones, después del grid o reemplazando contenido */}
                                            {selections[activeAttr.id]?.some(s => s.id === ENVIO_DOMICILIO_ID) && (
                                                <div className="mt-6 p-5 bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pasteleria-rosa shadow-inner">
                                                    <GoogleAddressSearch onAddressSelect={handleAddressSelect} />

                                                    {/* Feedback de precio en tiempo real */}
                                                    {selections[activeAttr.id].find(s => s.id === ENVIO_DOMICILIO_ID)?.calculated_address && (
                                                        <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm">
                                                            <span className="bg-green-600 text-white p-1 rounded-full text-[10px]">✓</span>
                                                            Costo de envío calculado:
                                                            ${selections[activeAttr.id].find(s => s.id === ENVIO_DOMICILIO_ID).additional_price}
                                                            {(selections[activeAttr.id].find(s => s.id === ENVIO_DOMICILIO_ID).distance_text) && (
                                                                <span className="text-xs text-gray-500">
                                                                    ({selections[activeAttr.id].find(s => s.id === ENVIO_DOMICILIO_ID).distance_text})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}



                                                    {/* Debajo del buscador de Google en tu modal */}
                                                    {selections[activeAttr.id]?.find(s => s.id === ENVIO_DOMICILIO_ID)?.address_detail && (
                                                        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200">
                                                            ✅ Envío confirmado a: {selections[activeAttr.id].find(s => s.id === ENVIO_DOMICILIO_ID).address_detail}
                                                            <br />
                                                            <span className="text-lg">+ ${selections[activeAttr.id].find(s => s.id === ENVIO_DOMICILIO_ID).additional_price}</span>
                                                        </div>
                                                    )}
                                                </div>





                                            )}

                                            {/* Botonera de Navegación */}
                                            <div className="flex justify-between mt-8">
                                                {/* <Button
                                                    variant="outline"
                                                    onClick={handlePrevStep}
                                                    // Deshabilitamos si no hay ningún atributo con step_number menor
                                                    disabled={!customizations.some(a => a.step_number < activeAttr.step_number)}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    className="bg-pasteleria-rosa text-white"
                                                    onClick={handleNextStep}
                                                    // Deshabilitamos si no hay ningún atributo con step_number mayor
                                                    disabled={!customizations.some(a => a.step_number > activeAttr.step_number)}
                                                >
                                                    Siguiente
                                                </Button> */}
                                            </div>
                                            {/* FIN CONFIGURADOR */}
                                            <DialogFooter>
                                                <Button
                                                    className="w-full bg-pasteleria-rosa"
                                                    onClick={() => { setIsConfigModalOpen(false); handleValidation(); }}
                                                >
                                                    Listo
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    )}
                                </div>
                                {/* FIN CONFIGURADOR */}
                                {/* <DialogFooter>
                                    <Button
                                        className="w-full bg-pasteleria-rosa"
                                        onClick={() => { setIsConfigModalOpen(false); handleValidation(); }}
                                    >
                                        Listo
                                    </Button>
                                </DialogFooter> */}
                            </DialogContent>
                        </Dialog>

                        {/* <Button className="w-full py-8 text-lg bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg transition-transform active:scale-95">
                            <ShoppingBag className="mr-2 size-6" />
                            Agregar al carrito
                        </Button> */}

                        <div className="flex flex-col gap-3">
                            {/* Botón Principal: Finalizar ya */}
                            <Button
                                onClick={() => addToCart(true)}
                                className="w-full py-8 text-lg bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg"
                            >
                                <ShoppingBag className="mr-2 size-6" />
                                Finalizar Pedido ahora
                            </Button>

                            {/* Botón Secundario: Seguir comprando */}
                            <Button
                                variant="outline"
                                onClick={() => addToCart(false)}
                                className="w-full py-4 text-pink-600 border-pink-200 hover:bg-pink-50 rounded-full"
                            >
                                Agregar y elegir otra torta
                            </Button>
                        </div>

                        <p className="text-center text-sm text-gray-400">
                            * Los pedidos se retiran por el local en Salta.
                        </p>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}