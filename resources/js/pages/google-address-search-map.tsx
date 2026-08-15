import { useJsApiLoader } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface GoogleAddressSearchProps {
    onAddressSelect: (data: any) => void;
    initialCoordinates?: { lat: number; lng: number };
}

export function GoogleAddressSearchMap({ onAddressSelect, initialCoordinates }: GoogleAddressSearchProps) {
    // 1. Cargamos la API de Google de forma segura con tu Key de entorno
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"], // Mantenemos places para el buscador
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);

    // Centro por defecto: Salta Capital
    const defaultCenter = initialCoordinates || { lat: -24.7821, lng: -65.4232 };

    useEffect(() => {

        if (isLoaded && inputRef.current) {
            // CLAVE: Solo ejecutamos la lógica si la API ya terminó de cargar
            if (!isLoaded || !mapRef.current || !inputRef.current) return;

            if (!window.google || !mapRef.current) return;

            // 1. Inicializar el Mapa
            const mapInstance = new google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: initialCoordinates ? 17 : 14,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
            });
            setMap(mapInstance);

            // 2. Inicializar el Marcador (Pin)
            const markerInstance = new google.maps.Marker({
                position: defaultCenter,
                map: mapInstance,
                draggable: true, // ¡Clave para que el usuario lo pueda mover!
                animation: google.maps.Animation.DROP,
            });
            setMarker(markerInstance);

            // 3. Inicializar el Autocomplete de Google en el input
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
                componentRestrictions: { country: "ar" },
                fields: ["geometry", "formatted_address"],
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(-24.85, -65.50),
                    new google.maps.LatLng(-24.70, -65.35)
                )
            });

            // Evento cuando eligen del buscador
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    const location = place.geometry.location;

                    // Movemos el mapa y el pin a la ubicación del buscador
                    mapInstance.setCenter(location);
                    mapInstance.setZoom(16);
                    markerInstance.setPosition(location);

                    // Disparamos la info al padre
                    onAddressSelect({
                        address: place.formatted_address,
                        lat: location.lat(),
                        lng: location.lng(),
                    });
                }
            });

            // 4. Evento cuando el usuario TERMINA de arrastrar el Pin
            markerInstance.addListener("dragend", () => {
                const position = markerInstance.getPosition();
                if (position) {
                    const lat = position.lat();
                    const lng = position.lng();

                    // Usamos Geocoder para obtener la dirección aproximada de donde soltó el pin
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        let addressText = "Ubicación señalada en el mapa";
                        if (status === "OK" && results && results[0]) {
                            addressText = results[0].formatted_address;
                            // Actualizamos el input de texto con la calle real del mapa
                            if (inputRef.current) inputRef.current.value = addressText;
                        }

                        // Avisamos al componente padre las nuevas coordenadas calculadas manualmente
                        onAddressSelect({
                            address: addressText,
                            lat: lat,
                            lng: lng,
                        });
                    });
                }
            });

            // 5. Evento al hacer Clic directo en cualquier parte del mapa
            mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    markerInstance.setPosition(e.latLng);
                    // Disparamos manualmente el evento dragend para reutilizar la lógica del geocoder
                    google.maps.event.trigger(markerInstance, 'dragend');
                }
            });

            return () => {
                google.maps.event.clearInstanceListeners(autocomplete);
                google.maps.event.clearInstanceListeners(markerInstance);
                google.maps.event.clearInstanceListeners(mapInstance);
            };
        }
    }, [isLoaded]); // CLAVE: Re-ejecutar cuando isLoaded pase de false a true


    // Función para resetear todo
    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
        }
        // Avisamos al padre que se desseleccionó la dirección
        onAddressSelect(null);
    };

    // Si la API no cargó, mostramos un estado de carga estético dentro del modal
    if (!isLoaded) {
        return (
            <div className="w-full h-72 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-4 border-pasteleria-rosa border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-gray-400 font-medium">Cargando mapa de Salta...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscá tu calle y número..."
                    className="w-full p-3 border rounded-xl shadow-sm text-gray-800 outline-none focus:ring-2 focus:ring-pasteleria-rosa"
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

            {/* Contenedor del Mapa físico */}
            <div
                ref={mapRef}
                className="w-full h-64 rounded-2xl border border-gray-200 shadow-inner overflow-hidden"
                style={{ minHeight: '260px' }}
            />

            <p className="text-[11px] text-gray-400 italic text-center">
                📍 Si la dirección no es exacta, podés arrastrar el marcador rosa o hacer clic en el mapa para corregirla.
            </p>
        </div>
    );
}