// resources/js/pages/admin/products/Edit.tsx
import { Head, router } from '@inertiajs/react';
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { SectionTitle } from '../section-title';
import { ProductForm } from "./product-form";

export default function Edit({ product, categories }) {
    const breadcrumbs = [{ module: 'productos', title: 'Editar Producto', href: route('admin.products.index'), action: 'edit', btnAction: 'Cancelar' }];
    // alert('formEdit');
    const handleSubmit = (values: any) => {
        const dataToSubmit = { ...values };

        // Si 'image' no es un objeto File (es decir, sigue siendo el string de la ruta vieja),
        // lo eliminamos del objeto para que Laravel no intente validarlo como archivo.
        if (!(dataToSubmit.image instanceof File)) {
            delete dataToSubmit.image;
        }

        // Truco Laravel: POST + _method: PUT para subir archivos
        router.post(route('admin.products.update', product.id), {
            ...dataToSubmit,
            _method: 'put',
        }, {
            forceFormData: true,
            onSuccess: () => toast.success("¡Producto actualizado!"),
            onError: (errors) => Object.values(errors).forEach(err => toast.error(err as string)),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Producto - Dulces Momentos" />
            <div className="flex flex-col gap-4 p-4">
                <SectionTitle lastBreadcrumb={breadcrumbs[0]} />
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <ProductForm
                        categories={categories}
                        initialData={product}
                        onSubmit={handleSubmit}
                        isEdit={true}
                        buttonText="Actualizar Torta"
                    />
                </div>
            </div>
        </AppLayout>
    );
}