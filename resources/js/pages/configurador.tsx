import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

export function Configurador({ customizations }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({});

    const totalSteps = customizations.length;
    const activeAttr = customizations[currentStep];

    const handleNext = () => {
        if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="space-y-6 p-4 border rounded-xl bg-white shadow-sm">
            {/* Indicador de Pasos */}
            <div className="flex justify-between mb-8">
                {customizations.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 flex-1 mx-1 rounded-full ${idx <= currentStep ? 'bg-pasteleria-rosa' : 'bg-gray-100'}`}
                    />
                ))}
            </div>

            {/* Título del Paso */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                    Paso {currentStep + 1}: {activeAttr?.name}
                </h3>
                <p className="text-sm text-gray-500">Seleccioná una opción para tu torta</p>
            </div>

            {/* Grilla de Opciones */}
            <div className="grid grid-cols-2 gap-4">
                {activeAttr?.options.map((opt) => (
                    <div
                        key={opt.id}
                        onClick={() => setSelections({ ...selections, [activeAttr.id]: opt })}
                        className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all ${selections[activeAttr.id]?.id === opt.id
                                ? 'border-pasteleria-rosa bg-pasteleria-rosa/5'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        {opt.image && (
                            <img src={`/storage/${opt.image}`} className="w-full h-24 object-cover rounded-lg mb-2" />
                        )}
                        <p className="font-semibold text-sm">{opt.name}</p>
                        {opt.additional_price > 0 && (
                            <p className="text-xs text-green-600">+$ {opt.additional_price}</p>
                        )}
                        {selections[activeAttr.id]?.id === opt.id && (
                            <div className="absolute top-2 right-2 bg-pasteleria-rosa text-white rounded-full p-1">
                                <Check size={12} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navegación */}
            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
                    <ChevronLeft className="mr-2" /> Atrás
                </Button>

                {currentStep === totalSteps - 1 ? (
                    <Button className="bg-pasteleria-rosa hover:bg-pasteleria-rosa/90">
                        Agregar al Carrito
                    </Button>
                ) : (
                    <Button onClick={handleNext} disabled={!selections[activeAttr.id]}>
                        Siguiente <ChevronRight className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}