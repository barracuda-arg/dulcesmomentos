import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Props {
    product: any;
    customizations: any[]; // Son los 'steps' que vienen del backend
    initialSelections: Record<number, any[]>;
    onSave: (selectedIds: number[]) => void;
}

export function AdminConfiguradorBase({ product, customizations, initialSelections, onSave }: Props) {
    console.log('=>', initialSelections); // gets ok
    const [currentStep, setCurrentStep] = useState(0);
    // Inicializamos con lo que ya tiene la base de datos
    const [selections, setSelections] = useState(initialSelections || {});

    const activeAttr = customizations[currentStep];

    const handleOptionClick = (opt: any) => {
        const attrId = activeAttr.id;
        const currentSelected = selections[attrId] || [];
        const isSelected = currentSelected.some(s => s.id === opt.id);

        let newSelections;

        if (isSelected) {
            // Si ya está, lo quitamos
            newSelections = currentSelected.filter(s => s.id !== opt.id);
        } else {
            // Si no está, lo agregamos al array del atributo
            newSelections = [...currentSelected, opt];
        }

        setSelections({
            ...selections,
            [attrId]: newSelections
        });
    };

    const handleFinalSave = () => {
        // Aplanamos todos los arrays de opciones para mandar solo los IDs a Laravel
        const allOptionIds = Object.values(selections)
            .flat()
            .map((opt: any) => opt.id);

        onSave(allOptionIds);
    };
    // console.log('---------->', activeAttr, activeAttr.options);

    return (
        <div className="w-full space-y-6">
            {/* <div className="border-b pb-4">
                <h2 className="text-lg font-bold">Configurando: {product.name}</h2>
                <p className="text-sm text-gray-500">Defina qué opciones vienen incluidas por defecto.</p>
            </div> */}

            {activeAttr && (
                <div className="mt-2 border p-6 rounded-2xl bg-white shadow-sm">
                    {/* Botonera de Navegación + Guardar */}
                    <div className="flex justify-between border-b mb-2 pb-3 border-opacity-90">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={currentStep === 0}
                        >
                            Anterior
                        </Button>

                        {currentStep === customizations.length - 1 ? (
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleFinalSave}>
                                <Save className="mr-2 h-4 w-4" /> Guardar Configuración
                            </Button>
                        ) : (
                            <Button
                                className="bg-pasteleria-rosa"
                                onClick={() => setCurrentStep(currentStep + 1)}
                            >
                                Siguiente
                            </Button>
                        )}
                    </div>
                    {/* Título del Paso */}
                    <h2 className="text-xl font-semibold mb-4 text-pasteleria-rosa">
                        Paso {currentStep + 1}: {activeAttr.name}
                    </h2>

                    {/* Grilla de Opciones (Tu código base) */}
                    {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
                        {activeAttr.options.map((opt) => {
                            console.log(activeAttr.id, opt);
                            const isSelected = selections[activeAttr.id]?.some(s => s.id === opt.id);
                            // console.log('?????????', opt.id, isSelected, selections[activeAttr.id]);

                            return (
                                <div
                                    key={opt.id}
                                    onClick={() => handleOptionClick(opt)}
                                    className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${isSelected
                                        ? 'border-pasteleria-rosa bg-pink-50'
                                        : 'border-gray-100 hover:border-pink-200'
                                        }`}
                                >
                                    {/* Agregué la imagen si existe, que es útil para el admin */}
                                    {opt.image && (
                                        <img src={`/${opt.image}`} className="w-full h-20 object-cover rounded-lg mb-2" />
                                    )}
                                    <p className="font-medium text-center text-sm">{opt.name}</p>
                                    <p className="text-xs text-green-600 text-center">+ ${opt.additional_price}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* ////////////////////////// botonera */}
                </div>
            )}
        </div>
    );
}