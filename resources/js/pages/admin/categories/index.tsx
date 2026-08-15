// resources/js/pages/Admin/Categories/Index.tsx
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit2, Plus } from 'lucide-react';
import { SectionTitle } from '../section-title';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ConfirmDeleteModal } from '../../confirm-delete-modal';
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        module: 'categorias',
        title: 'Lista de Categorias',
        href: route('admin.categories.create'),
        action: 'list',
        btnAction: '+ Nueva Categoría',
    },
];


export default function Index({ categories }) {

    // 1. Extraemos las props globales de Inertia
    const { flash } = usePage().props as any;

    const [isOpen, setIsOpen] = useState(false); // 👈 Nuevo estado para controlar el modal

    // Dentro de tu componente Index.tsx
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData(prev => ({
            ...prev,
            name: name,
            slug: name
                .toLowerCase()
                .trim()
                .replace(/[^\w ]+/g, '') // Quita caracteres especiales
                .replace(/ +/g, '-')     // Cambia espacios por guiones
        }));
    };

    const [editingCategory, setEditingCategory] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        slug: '',
        is_active: true
    });
    // Función para abrir el modal en modo "Crear"
    const openCreate = () => {
        setEditingCategory(null);
        reset();
        setIsOpen(true);
    };

    // Función para abrir el modal en modo "Editar"
    const openEdit = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            slug: category.slug,
            is_active: !!category.is_active
        });
        setIsOpen(true); // 👈 Ahora sí forzamos la apertura
    };

    const submit = (e) => {
        e.preventDefault();

        // const action = editingCategory
        //     ? put(route('admin.categories.update', editingCategory.id))
        //     : post(route('admin.categories.store'));

        // Usamos las opciones de Inertia para cerrar el modal
        if (editingCategory) {
            put(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast.success("¡El registro se modificó correctamente!");
                }
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast.success("¡El registro se agregó correctamente!");
                }
            });
        }
    };
    // CONFIRM DELETE DIALOG/////////////////////////////
    // 1. Estado para manejar el modal y el ID a eliminar
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    });

    const openDeleteTarget = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal.id) return;

        // destroy(route('admin.categories.destroy', cat.id))
        destroy(route('admin.categories.destroy', deleteModal.id), {
            // onSuccess: (page) => {
            //     closeDeleteModal();

            //     // toast.success("¡El registro se eliminó correctamente!");
            //     // Si Laravel envió un mensaje flash de éxito:
            //     if (page.props.flash?.success) {
            //         toast.success("¡El registro se eliminó correctamente!");
            //     }
            // },
            // onFinish: () => {
            //     // 2. ¡Acá está el truco! Revisamos si el backend envió un flash de error
            //     // Usamos un pequeño timeout o validación directa porque la sesión flash actualiza las props
            //     const currentProps = usePage().props as any;

            //     if (currentProps.flash?.error) {
            //         toast.error(currentProps.flash.error, {
            //             description: "Verifica las dependencias del registro.",
            //             duration: 5000 // Le damos tiempo para que el pastelero lo lea bien
            //         });
            //     }
            // }

            // El parámetro 'page' contiene toda la info fresca del servidor
            onSuccess: (page: any) => {

                setDeleteModal({ isOpen: false, id: null });

                // 1. Si la categoría se borró con éxito
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                }

                // 2. Si Laravel rebotó la acción y mandó un mensaje de error (ej: categoría con productos)
                if (page.props.flash?.error) {
                    toast.error(page.props.flash.error, {
                        description: "Primero elimina los productos para esa categoria.",
                        duration: 5000
                    });
                }
            },
            onError: () => {
                toast.error("Ocurrió un error inesperado en el servidor.");
            }

        });
    };

    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Algodon" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Head title="Admin - Productos" />
                {/* <SectionTitle lastBreadcrumb={breadcrumbs[breadcrumbs.length - 1]} /> */}



                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>

                        <Dialog open={isOpen} onOpenChange={setIsOpen} >
                            <DialogTrigger asChild>
                                <Button className="bg-pasteleria-rosa hover:bg-pasteleria-rosa/90" onClick={() => openCreate()}>
                                    <Plus className="mr-2 size-4" /> Nueva Categoría
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingCategory ? 'Editar' : 'Nueva'} Categoría</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <Label className='pb-2'>Nombre de la Categoría</Label>
                                        <Input
                                            placeholder="Nombre (ej: Tortas Especiales)"
                                            value={data.name}
                                            onChange={handleNameChange}
                                        // onChange={e => setData('name', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label className='pb-2'>Slug para busqueda desde google</Label>
                                        <Input
                                            placeholder="Slug (ej: tortas-especiales)"
                                            value={data.slug}
                                            onChange={e => setData('slug', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                        <Label htmlFor="is_active">Categoría visible en el sitio</Label>
                                    </div>

                                    {/* Checkbox para is_active aquí */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {editingCategory ? 'Actualizar' : 'Guardar'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell>{cat.slug}</TableCell>
                                    <TableCell>{cat.is_active ? '✅ Activa' : '❌ Inactiva'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteTarget(cat.id)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

            </div>
            {/* 3. COLOCÁS EL MODAL REUTILIZABLE AL FINAL */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                processing={processing}
                // Opcional: Podés personalizar los textos si es para otra cosa
                title="¿Eliminar este elemento?"
            />
        </AppLayout>
    );
}