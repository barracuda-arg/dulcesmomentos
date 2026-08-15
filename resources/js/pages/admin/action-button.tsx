import { Link } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

type ActionButtonProps = {
    bcItem: BreadcrumbItem;
    type?: 'link' | 'modal';
    onAddItem?: () => void;
    // 🌟 CLAVE 1: Permitir que Shadcn meta sus propiedades invisibles (onClick, aria-*, etc.)
    [key: string]: any;
};

export const ActionButton = ({
    bcItem,
    type = 'link',
    onAddItem,
    ...props // 🌟 Capturamos todas las propiedades que inyecte Shadcn
}: ActionButtonProps) => {
    const buttonClass = "bg-pasteleria-rosa px-4 py-2 text-white rounded-md font-bold hover:opacity-90 transition";

    // Lógica para determinar el texto del botón (Si es agregar feedback, agregar producto, etc.)
    // Aseguramos que si no encuentra una traducción específica, muestre el título o un fallback
    const buttonText = bcItem?.title ? `Agregar ${bcItem.title}` : 'Agregar Item';

    if (type === 'modal') {
        return (
            <button
                type="button"
                // 🌟 CLAVE 2: Le pasamos las propiedades de Shadcn al botón HTML real
                {...props}
                // Si además querés ejecutar algo tuyo propio, lo podés combinar:
                onClick={(e) => {
                    if (props.onClick) props.onClick(e); // Abre el modal de Shadcn
                    if (onAddItem) onAddItem();         // Ejecuta tu lógica si existiera
                }}
                className={buttonClass}
            >
                {/* 🌟 CLAVE 3: Asegurar que el texto se renderice acá adentro */}
                {buttonText}
            </button>
        );
    }

    return (
        bcItem.btnAction && (
            <Link
                href={bcItem.href}
                className={buttonClass}
            >
                {bcItem.btnAction}
            </Link>
        )
    );
};