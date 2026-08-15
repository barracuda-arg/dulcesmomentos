import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Asumiendo que usas shadcn/ui
import { Input } from "@/components/ui/input";

interface QuantitySelectorProps {
    min?: number;
    max?: number;
    onChange?: (quantity: number) => void;
}

export const QuantitySelector = ({ min = 1, max = 99, onChange }: QuantitySelectorProps) => {
    const [quantity, setQuantity] = useState<number>(min);

    const handleIncrement = () => {
        if (quantity < max) {
            const newVal = quantity + 1;
            setQuantity(newVal);
            if (onChange) onChange(newVal);
        }
    };

    const handleDecrement = () => {
        if (quantity > min) {
            const newVal = quantity - 1;
            setQuantity(newVal);
            if (onChange) onChange(newVal);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= min && value <= max) {
            setQuantity(value);
            if (onChange) onChange(value);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= min}
                className="h-8 w-8 border-pasteleria-rosa text-pasteleria-rosa hover:bg-pink-50"
            >
                <Minus className="h-4 w-4" />
            </Button>

            <Input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                className="h-8 w-14 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={quantity >= max}
                className="h-8 w-8 border-pasteleria-rosa text-pasteleria-rosa hover:bg-pink-50"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};