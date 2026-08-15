// // resources/js/pages/admin/products/Create.tsx
// import { Head, router } from '@inertiajs/react';
// import { toast } from "sonner";
// import AppLayout from "@/layouts/app-layout";
// import { SectionTitle } from '../section-title';
// import { ProductForm } from "./product-form";

// export default function Create({ categories }) {
//     const breadcrumbs = [{ module: 'productos', title: 'Nuevo Producto', href: route('admin.products.index'), action: 'create', btnAction: 'Cancelar' }];
//     alert('formCreate');
//     const handleSubmit = (values: any) => {
//         router.post(route('admin.products.store'), values, {
//             forceFormData: true,
//             onSuccess: () => toast.success("¡Torta guardada!"),
//             onError: (errors) => Object.values(errors).forEach(err => toast.error(err as string)),
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Nuevo Producto - Dulces Momentos" />
//             <div className="flex flex-col gap-4 p-4">
//                 <SectionTitle lastBreadcrumb={breadcrumbs[0]} />
//                 <div className="bg-card p-6 rounded-lg shadow-sm">
//                     <ProductForm categories={categories} onSubmit={handleSubmit} />
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
import { Head, router } from '@inertiajs/react';
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { SectionTitle } from '../section-title';
import { ProductForm } from "./product-form"; // Verifica que la ruta sea correcta

export default function Create({ categories }) {
    const breadcrumbs = [
        {
            module: 'productos',
            title: 'Nuevo Producto',
            href: route('admin.products.index'),
            action: 'create',
            btnAction: 'Cancelar'
        }
    ];

    const handleSubmit = (values: any) => {
        // Usamos router.post para enviar el FormData automáticamente
        router.post(route('admin.products.store'), values, {
            forceFormData: true,
            onSuccess: () => {
                toast.success("¡Torta guardada exitosamente!");
            },
            onError: (errors) => {
                // Si hay muchos errores, mostramos solo los principales o el primero para no saturar
                const errorMessages = Object.values(errors);
                errorMessages.forEach(err => toast.error(err as string));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Nuevo Producto - Pastelería Díaz" />

            <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto">
                <SectionTitle lastBreadcrumb={breadcrumbs[0]} />

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"> */}
            <Head title="Nuevo Producto - Dulces Momentos" />
            <div className="flex flex-col gap-4 p-4">
                <SectionTitle lastBreadcrumb={breadcrumbs[0]} />
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <ProductForm
                        categories={categories}
                        onSubmit={handleSubmit}
                        buttonText="Crear Producto"
                    />
                </div>
            </div>
        </AppLayout>
    );
}