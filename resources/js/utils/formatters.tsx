// resources/js/utils/formatters.ts
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
    }).format(price);
};

export const getImagePath = (path: string | null) => {
    if (!path) {
        return '/images/demo-default-image.png'; // Ruta a la imagen por defecto
    }

    const imageUrl = path.includes('demo') ? path : `/storage/${path}`;

    return imageUrl;
};