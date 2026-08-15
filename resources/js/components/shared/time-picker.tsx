// resources/js/components/shared/TimePicker.tsx
import React from 'react';
import { Label } from '@/components/ui/label';

interface TimePickerProps {
    value: string; // Recibe "HH:mm" (ej: "18:30")
    onChange: (time: string) => void; // Devuelve "HH:mm" al cambiar
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    // Desarmamos el string "18:30" de forma segura
    const [hour, minute] = value ? value.split(':') : ['18', '00'];

    const horasDisponibles = Array.from({ length: 15 }, (_, i) => String(i + 8).padStart(2, '0')); // 08 a 22 hs
    const minutosDisponibles = ['00', '15', '30', '45'];

    const handleSelectChange = (newHour: string, newMinute: string) => {
        onChange(`${newHour}:${newMinute}`);
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            <div>
                <Label >Hora</Label>
                <select
                    value={hour}
                    onChange={(e) => handleSelectChange(e.target.value, minute)}
                    className="w-full h-9 p-2 bg-gray-50 border rounded-xl outline-none focus:border-pink-400"
                >
                    {horasDisponibles.map(h => <option key={h} value={h}>{h} hs</option>)}
                </select>
            </div>
            <div>
                <Label >Minutos</Label>
                <select
                    value={minute}
                    onChange={(e) => handleSelectChange(hour, e.target.value)}
                    className="w-full h-9 p-2 bg-gray-50 border rounded-xl outline-none focus:border-pink-400"
                >
                    {minutosDisponibles.map(m => <option key={m} value={m}>{m} min</option>)}
                </select>
            </div>
        </div>
    );
}