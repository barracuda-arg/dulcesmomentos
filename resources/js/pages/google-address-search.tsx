import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api'; // <--- ESTO FALTABA

export function GoogleAddressSearch({ onAddressSelect }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const inputRef = useRef<HTMLInputElement>(null);


    // Función para resetear todo
    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
        }
        // Avisamos al padre que se desseleccionó la dirección
        onAddressSelect(null);
    };

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                componentRestrictions: { country: "ar" },
                fields: ["geometry", "formatted_address"],
                // Forzamos a que busque preferentemente en Salta
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(-24.85, -65.50),
                    new google.maps.LatLng(-24.70, -65.35)
                ),
                strictBounds: false // Permite Salta pero no bloquea si es muy cerca del límite
            });

            // Este evento se dispara tanto con CLICK de mouse como con ENTER en la lista
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();

                // Si el usuario escribió algo pero no eligió de la lista, place.geometry será undefined
                if (!place.geometry || !place.geometry.location) {
                    console.log("No se seleccionó un item de la lista, intentando fallback...");
                    return;
                }

                console.log("🚀 Selección confirmada:", place.formatted_address);

                // Disparamos la acción directamente al Padre SIN botón
                onAddressSelect({
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            });

            // Evitar que el formulario se envíe al apretar Enter
            const stopEnter = (e: KeyboardEvent) => {
                if (e.key === 'Enter') e.preventDefault();
            };
            inputRef.current.addEventListener('keydown', stopEnter);

            return () => {
                google.maps.event.clearInstanceListeners(autocomplete);
            };
        }
    }, [isLoaded]);

    return (

        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Dirección de entrega</label>
            <div className="relative flex items-center justify-center">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Calle y número (Ej: Av. Belgrano 123)"
                    className="w-full p-3 border border-pink-100 rounded-md text-black pac-target-input bg-white hover:border-pink-700 focus:border-pink-700 focus:outline-none transition-colors"
                />
                {/* Botón X para limpiar */}
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    title="Limpiar dirección"
                >
                    <MapPin className="transition-transform duration-300 group-hover:translate-x-1 stroke-pink-700" size={20} />
                </button>
            </div>
            <p className="text-[10px] text-gray-400 italic">
                Seleccioná tu dirección de la lista para calcular el costo de envío.
            </p>
        </div>
    );
}