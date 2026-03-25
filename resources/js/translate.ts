import { usePage } from '@inertiajs/react';

export function __(key: string): string {
    const { translations } = usePage().props as any;

    // Si la traducción existe en el JSON, la devuelve; si no, devuelve la clave original
    return translations[key] || key;
}