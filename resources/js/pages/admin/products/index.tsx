// import { Head, Link } from '@inertiajs/react';
// import { Pencil, Settings2, Trash2 } from 'lucide-react';
// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogClose,
//     DialogHeader,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog';

// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import AppLayout from '@/layouts/app-layout';
// import { dashboard } from '@/routes';
// import type { BreadcrumbItem } from '@/types';
// import { SectionTitle } from '../section-title';
// import { formatPrice } from '@/utils/formatters';
// import { DeleteProductAction } from './delete-product-action';

// import { router } from '@inertiajs/react';
// import { Configurador } from '@/pages/configurador';
// import Admin from '@/actions/App/Http/Controllers/Admin';
// import { AdminConfiguradorBase } from '@/pages/AdminConfiguradorBase';



// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         module: 'productos',
//         title: 'Lista de Productos',
//         href: route('admin.products.create'),
//         action: 'list',
//         btnAction: '+ Nuevo Producto',
//     },
// ];

// const handleDelete = (id: number, name: string) => {
//     if (confirm(`¿Estás seguro de que querés eliminar "${name}"? Esta acción no se puede deshacer.`)) {
//         router.delete(route('admin.products.destroy', id), {
//             onSuccess: () => toast.success("Producto eliminado"),
//             onError: () => toast.error("No se pudo eliminar el producto"),
//         });
//     }
// };
// export default function Index({ products }) {

//     const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//     const openDefaultConfigModal = (product: Product) => {
//         setSelectedProduct(product);
//         setIsConfigModalOpen(true);
//     };

//     const handleSaveDefaultConfig = (productId: number, optionIds: number[]) => {
//         router.post(route('admin.products.update-defaults', productId), {
//             option_ids: optionIds
//         }, {
//             onSuccess: () => {
//                 setIsConfigModalOpen(false);
//                 // Mostrar un toast de éxito (Pastelería Díaz actualizada!)
//             }
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Algodon" />
//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 <Head title="Admin - Productos" />
//                 <SectionTitle lastBreadcrumb={breadcrumbs[breadcrumbs.length - 1]} />
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {products.data.map((product) => (
//                             <tr key={product.id}>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="flex items-center">
//                                         <img className="h-10 w-10 rounded-full object-cover mr-3"
//                                             src={product.image.includes('demo') ? product.image : `/storage/${product.image}`}
//                                             alt={product.name} />
//                                         <span className="font-medium text-gray-900">{product.name}</span>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {product.category.name}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pasteleria-rosa">
//                                     <span>{formatPrice(product.price)}</span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                         {product.is_active ? 'Activo' : 'Inactivo'}
//                                     </span>
//                                 </td>
//                                 <td className="flex items-center gap-2 justify-end px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

//                                     <Button variant="outline" size="sm" asChild>
//                                         <Link href={route('admin.products.edit', product.id)}>
//                                             <Pencil className="mr-2 h-4 w-4" />
//                                             Editar
//                                         </Link>
//                                     </Button>

//                                     <DeleteProductAction
//                                         productId={product.id}
//                                         productName={product.name}
//                                     />
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => openDefaultConfigModal(product)}
//                                     >
//                                         <Settings2 className="mr-2 h-4 w-4" /> Configurar Base
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
//                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                         <DialogTitle>Configurar Receta Base: {selectedProduct?.name}</DialogTitle>
//                         <DialogDescription>
//                             Selecciona las opciones que vendrán incluidas por defecto en este producto.
//                         </DialogDescription>
//                     </DialogHeader>

//                     {/* REUTILIZAMOS TU COMPONENTE CONFIGURADOR */}
//                     {selectedProduct && (
//                         <AdminConfiguradorBase
//                             product={selectedProduct}
//                             // Le pasamos las opciones que ya tiene guardadas en la DB
//                             initialSelections={selectedProduct.default_options}
//                             onSave={(ids) => handleSaveDefaultConfig(selectedProduct.id, ids)}
//                         />
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </AppLayout>
//     );
// }

import { useState } from 'react'; // 👈 Faltaba el useState
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Settings2 } from 'lucide-react';
import Pagination from '@/components/pagination'; // 🌟 Importamos tu nuevo juguete
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { SectionTitle } from '../section-title';
import { formatPrice } from '@/utils/formatters';
import { DeleteProductAction } from './delete-product-action';
import { AdminConfiguradorBase } from '../../AdminConfiguradorBase';

// Corregí estas rutas según dónde hayas guardado el archivo realmente

import { toast } from 'sonner'; // O la librería de toasts que uses

const breadcrumbs: BreadcrumbItem[] = [
    {
        module: 'productos',
        title: 'Lista de Productos',
        href: route('admin.products.create'),
        action: 'list',
        btnAction: '+ Nuevo Producto',
    },
];

// 👈 Agregamos 'steps' a las props, que deben venir del controlador
export default function Index({ products, steps }) {

    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const openDefaultConfigModal = (product: any) => {
        setSelectedProduct(product);
        setIsConfigModalOpen(true);
    };

    const handleSaveDefaultConfig = (productId: number, optionIds: number[]) => {
        router.post(route('admin.products.update-defaults', productId), {
            option_ids: optionIds
        }, {
            onSuccess: () => {
                setIsConfigModalOpen(false);
                toast.success("Receta base de Pastelería Díaz actualizada");
            },
            onError: () => toast.error("Hubo un error al guardar")
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Productos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SectionTitle lastBreadcrumb={breadcrumbs[breadcrumbs.length - 1]} />

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.data.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full object-cover mr-3"
                                            src={product.image}
                                            alt={product.name} />
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pasteleria-rosa">
                                    {formatPrice(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2">
                                    <Button variant="outline"
                                        asChild
                                    >
                                        <Link href={route('admin.products.edit', product.id)}>
                                            <Pencil className="mr-1 h-3 w-3" /> Editar
                                        </Link>
                                    </Button>

                                    {/* Botón para abrir el Modal de Configuración Base */}
                                    {!!product.is_customizable && (
                                        <Button
                                            variant="outline"
                                            onClick={() => openDefaultConfigModal(product)}
                                            className="border-pasteleria-rosa text-pasteleria-rosa hover:bg-pink-50"
                                        >
                                            <Settings2 className="mr-1" /> Base
                                        </Button>
                                    )}

                                    <DeleteProductAction
                                        productId={product.id}
                                        productName={product.name}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 🌟 LA MAGIA DE UNA SOLA ETIQUETA ACÁ: */}
                <Pagination links={products.meta.links} />
            </div>

            {/* MODAL DE CONFIGURACIÓN BASE */}
            <div className='w-full space-y-6 min-h-[400px] flex flex-col'>
                <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
                    {/* <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"> */}
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:top-[5%] sm:translate-y-0 translate-x-[-50%] left-[50%]">
                        <DialogHeader>
                            <DialogTitle>Receta Base: {selectedProduct?.name}</DialogTitle>
                            <DialogDescription>
                                Marcá las opciones que Eliana ya incluye en el precio de esta torta.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedProduct && (
                            <AdminConfiguradorBase
                                product={selectedProduct}
                                customizations={steps} // 👈 Pasamos los atributos y opciones que traemos de Laravel
                                // Transformamos el array de la DB en el objeto que espera el componente
                                // initialSelections={selectedProduct.default_options || {}}
                                initialSelections={selectedProduct.default_options_grouped || {}}
                                onSave={(ids) => handleSaveDefaultConfig(selectedProduct.id, ids)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
