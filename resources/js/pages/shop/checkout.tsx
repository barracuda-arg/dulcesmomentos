import { useForm, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import { TimePicker } from '@/components/shared/time-picker';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
// Importamos los estilos obligatorios de la librería para las banderitas
import 'react-phone-number-input/style.css';
import { Info } from 'lucide-react';

export default function Checkout({ auth, errors }) {


    const [direccion, setDireccion] = useState("");


    const savedDelivery = JSON.parse(localStorage.getItem('delivery_info') || '{}');
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // 2. Definimos el formulario con toda la data desde el nacimiento del componente
    const { data, setData, post, processing } = useForm({
        customer_name: auth.user?.name || '',
        customer_email: auth.user?.email || '',
        customer_phone: '',

        // Unificamos la info de entrega directamente acá usando cortocircuitos (|| o ??)
        delivery_address: savedDelivery.address || '',
        delivery_cost: savedDelivery.cost || 0,
        delivery_distance: savedDelivery.distance || '',
        delivery_lat: savedDelivery.lat || '',
        delivery_lng: savedDelivery.lng || '',
        is_delivery: savedDelivery.isDelivery || false,

        // delivery_date: '',
        // delivery_time_slot: 'tarde',

        date_part: '',  // Guarda solo "YYYY-MM-DD" (se vincula directo al input date)
        time_part: '18:00', // Guarda solo "HH:mm" (se vincula directo al TimePicker)

        notes: '',

        cart_items: savedCart,
    });
    const [phoneError, setPhoneError] = useState('');
    // ¡ELIMINÁS EL useEffect COMPLETAMENTE!

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🛡️ Validación en el cliente antes de mandar a Laravel
        if (!data.customer_phone) {
            setPhoneError('El número de teléfono es obligatorio.');
            return;
        }

        if (!isValidPhoneNumber(data.customer_phone)) {
            setPhoneError('El formato del número no es válido. Revisá el código de área.');
            return;
        }

        setPhoneError('');

        post(route('cart.store'), {
            onSuccess: () => {
                // Limpiamos el carrito local tras la compra exitosa
                localStorage.removeItem('cart');
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Finalizar Pedido - Pastelería Díaz" />
            <div className="container mx-auto p-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Datos de Entrega</h1>


                {/* MOSTRAR ERROR GENERAL DEL BACKEND */}
                {errors.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"></svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errors.error}</p>
                            </div>
                        </div>
                    </div>
                )}



                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border">
                    {/* Sección: Contacto */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="customer_name">Nombre Completo</Label>
                            <Input
                                id="customer_name"
                                value={data.customer_name}
                                onChange={e => setData('customer_name', e.target.value)}
                                placeholder="Ej: Juan Pérez"
                            />
                            {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                        </div>

                        {/* <div>
                            <Label htmlFor="customer_phone">WhatsApp (Sin el 0 y sin el 15)</Label>
                            <Input
                                id="customer_phone"
                                value={data.customer_phone}
                                onChange={e => setData('customer_phone', e.target.value)}
                                placeholder="Ej: 3874555666"
                            />
                            {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                        </div> */}
                        {/* Teléfono con Banderita y Máscara */}
                        <div className="space-y-1.5">
                            <label className="">Teléfono Celular (WhatsApp)</label>

                            <div className="phone-container">
                                <PhoneInput
                                    international
                                    defaultCountry="AR" // 🇦🇷 Argentina por defecto
                                    value={data.customer_phone}
                                    onChange={(value) => setData('customer_phone', value || '')}
                                    placeholder="54 387 5203344"
                                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 transition-all font-mono font-medium"
                                />
                            </div>

                            {/* Cartelito de ayuda UX (El aviso del 15 y el formato) */}
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 text-amber-800">
                                <Info size={16} className="shrink-0 mt-0.5" />
                                <div className="text-[11px] leading-tight font-medium">
                                    <p className="font-bold mb-0.5">⚠️ Importante para el envío de alertas:</p>
                                    Ingresá el código de área (ej: <span className="font-bold font-mono">387</span> para Salta) seguido del número completo. <span className="underline decoration-wavy font-bold">NO antepongas el 15</span>.
                                </div>
                            </div>

                            {/* Errores de Validación */}
                            {phoneError && (
                                <p className="text-xs font-bold text-red-500 animate-pulse">{phoneError}</p>
                            )}
                            {errors.customer_phone && (
                                <p className="text-xs font-bold text-red-500">{errors.customer_phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Sección: Ubicación BOBA */}
                    <div>
                        <Label htmlFor="delivery_address">Dirección de Entrega (Calle y altura)</Label>
                        <Input
                            id="delivery_address"
                            value={data.delivery_address}
                            placeholder="Ej: Av. Belgrano 1234"
                            readOnly={true}
                        />
                        {/* <p className="text-xs text-gray-400 mt-1">Próximamente: Mapa interactivo</p> */}
                    </div>

                    {/* Sección: Fecha y Notas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="delivery_date">Fecha de Entrega</Label>
                            <Input
                                id="delivery_date"
                                type="date"
                                value={data.date_part}
                                onChange={e => setData('date_part', e.target.value)}
                            />
                            {errors.date_part && <p className="text-red-500 text-sm mt-1">{errors.date_part}</p>}
                        </div>
                        <div>
                            {/* <Label htmlFor="slot">Franja Horaria</Label>
                            <select
                                id="slot"
                                className="w-full border rounded-md p-2"
                                value={data.delivery_time_slot}
                                onChange={e => setData('delivery_time_slot', e.target.value)}
                            >
                                <option value="mañana">Mañana (9:00 - 13:00)</option>
                                <option value="tarde">Tarde (17:00 - 21:00)</option>
                            </select> */}

                            <TimePicker
                                value={data.time_part}
                                onChange={val => setData('time_part', val)} // Recibe "18:30" directo
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="notes">Notas especiales (Ej: "Tocar el timbre fuerte", "Sin crema")</Label>
                        {/*                         <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                        /> */}
                        <RichTextEditor
                            value={data.notes}
                            onChange={(val) => setData('notes', val)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-pasteleria-rosa hover:bg-pink-700 py-6 text-lg rounded-xl"
                    >
                        {processing ? 'Procesando...' : 'Confirmar y Pedir'}
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
}