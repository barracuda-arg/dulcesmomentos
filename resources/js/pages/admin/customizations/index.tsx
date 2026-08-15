import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, Loader2, Edit, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from '@/layouts/app-layout';
import { ImageZoom } from '@/pages/zoom';
import { Switch } from "@/components/ui/switch";
import { router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { is } from 'zod/v4/locales';

const breadcrumbs: BreadcrumbItem[] = [
    {
        module: 'Ingredientes y Personalizaciones',
        title: 'Lista de Ingredientes y Personalizaciones',
        href: route('admin.categories.create'),
        action: 'list',
        btnAction: '+ Nueva Categoría',
    },
];

export default function Index({ attributes }) {
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
    const [isOptModalOpen, setIsOptModalOpen] = useState(false);

    // Formulario para Atributos (Grupos)
    // const attrForm = useForm({
    //     name: '',
    //     is_multiple: false,
    //     is_required: false,
    // });

    // Formulario para Opciones (Detalles)
    const optForm = useForm({
        name: '',
        description: '',
        additional_price: 0,
        image: null as File | null,
    });

    const submitAttribute = (e) => {
        e.preventDefault();
        attrForm.post(route('admin.customizations.store'), {
            onSuccess: () => {
                setIsAttrModalOpen(false);
                attrForm.reset();
            }
        });
    };

    const submitOption = (e) => {
        e.preventDefault();

        if (!selectedAttribute) {
            return; // Guard clause de seguridad
        }
        if (editingOption) {
            // Modo Edición
            optForm.post(route('admin.customizations.options.update', editingOption.id), {
                onSuccess: () => closeOptModal(),
            });
        } else {
            // Modo Creación
            optForm.post(route('admin.customizations.options.store', selectedAttribute.id), {
                onSuccess: () => closeOptModal(),
            });
        }

        // optForm.post(route('admin.customizations.options.store', selectedAttribute.id), {
        //     onSuccess: () => {
        //         setIsOptModalOpen(false);
        //         optForm.reset();
        //     }
        // });
    };

    const [editingOption, setEditingOption] = useState(null);

    /************** */
    const [editingAttribute, setEditingAttribute] = useState<any>(null);
    // const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
    const attrForm = useForm({
        name: '',
        step_number: 1,
        is_multiple: false,
        is_active: true,
        is_required: false,
    });

    // Función para cargar los datos en el form
    const openEditAttr = (attr: any) => {
        setEditingAttribute(attr);
        attrForm.setData({
            name: attr.name,
            step_number: attr.step_number,
            is_multiple: !!attr.is_multiple,
            is_active: !!attr.is_active,
            is_required: !!attr.is_required,
        });
        setIsAttrModalOpen(true);
    };

    // 2. AGREGÁ esta para crear (El "Reset")
    const openCreateAttr = () => {
        setEditingAttribute(null); // Fundamental para que el submit sepa que es POST y no PUT
        attrForm.reset();          // Limpia todos los campos a sus valores iniciales
        attrForm.clearErrors();     // Limpia errores de validaciones anteriores si los hubo
        setIsAttrModalOpen(true);
    };
    /***************** */

    // Función para abrir el modal en modo edición
    const openEditOption = (attribute, option) => {
        setSelectedAttribute(attribute);
        setEditingOption(option);

        optForm.setData({
            name: option.name,
            description: option.description || '',
            additional_price: option.additional_price,
            image: null, // No cargamos la imagen vieja en el input file
        });

        setIsOptModalOpen(true);
    };

    // Función para limpiar al cerrar
    const closeOptModal = () => {
        setIsOptModalOpen(false);
        setEditingOption(null);
        setPreviewUrl(null); // 👈 Limpiamos la URL temporal
        optForm.reset();
    };

    const openCreateOption = (attribute) => {
        setSelectedAttribute(attribute);
        setEditingOption(null); // 👈 Crucial: Limpiamos el modo edición
        optForm.reset();         // 👈 Crucial: Limpiamos los campos del formulario
        setIsOptModalOpen(true);
    };

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Función para manejar el cambio de archivo
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            optForm.setData('image', file);
            // Creamos la URL temporal para el preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };



    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    // Función que abre el modal de confirmación
    const confirmDelete = (option: any) => {
        setItemToDelete(option);
        setIsAlertOpen(true);
    };

    // Función que realmente ejecuta la eliminación
    const executeDelete = () => {
        if (!itemToDelete) return;

        router.delete(route('admin.customizations.options.destroy', itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAlertOpen(false);
                setItemToDelete(null);
            }
        });
    };










    const deleteOption = (option) => {
        if (confirm(`¿Estás seguro de que querés eliminar "${option.name}"? Esta acción no se puede deshacer.`)) {
            router.delete(route('admin.customizations.options.destroy', option.id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Opcional: mostrar un toast de éxito
                }
            });
        }
    };
    // const toggleOptionStatus = (option) => {
    //     router.patch(route('admin.customizations.options.update', option.id), {
    //         is_active: !option.is_active,
    //         // Mandamos los demás datos actuales para que el validate no falle
    //         name: option.name,
    //         additional_price: option.additional_price
    //     }, { preserveScroll: true });
    // };
    const toggleOptionStatus = (option) => {
        // Usamos la URL directa en lugar de route()
        router.put(`/admin/customizations/options/${option.id}`, {
            is_active: !option.is_active,
            name: option.name,
            additional_price: option.additional_price,
        }, {
            preserveScroll: true,
        });
    };

    console.log('Attributes recibidos:', attributes); // Debugging: Ver qué datos llegan al componente
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Algodon" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Head title="Admin - Productos" />

                <div className="p-8">
                    <Head title="Personalizaciones - Dulces Momentos" />

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900">Personalizaciones</h1>
                            <p className="text-neutral-500">Gestioná rellenos, bizcochuelos y decoración global.</p>
                        </div>

                        <Dialog open={isAttrModalOpen} onOpenChange={setIsAttrModalOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openCreateAttr} className="bg-pasteleria-rosa">
                                    <Plus className="mr-2 size-4" /> Nuevo Grupo
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Nuevo Grupo de Personalización</DialogTitle></DialogHeader>
                                {/* {selectedAttribute && ( // 👈 Solo renderiza si hay un atributo */}
                                <>
                                    <form onSubmit={submitAttribute} className="space-y-4">
                                        <div>
                                            <Label className='pb-4'>Nombre del Grupo</Label>
                                            <Input value={attrForm.data.name} onChange={e => attrForm.setData('name', e.target.value)} placeholder="Ej: Rellenos" />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={attrForm.processing}>Guardar Grupo</Button>
                                    </form>
                                </>
                                {/* )} */}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {attributes.map((attr) => (


                            <AccordionItem key={attr.id} value={`item-${attr.id}`} className="border rounded-xl px-4 bg-white shadow-sm">
                                {/* <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <div className="flex items-center gap-4">
                                            <span className="bg-pasteleria-rosa text-white text-xs px-2 py-1 rounded-full">
                                                Paso {attr.step_number}
                                            </span>
                                            <span className="font-bold">{attr.name}</span>
                                            {attr.is_multiple && (
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                                                    Múltiple
                                                </span>
                                            )}
                                        </div>

                                        /////////////////BOTÓN EDITAR GRUPO
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el acordeón se cierre al cliquear el lápiz
                                                openEditAttr(attr);
                                            }}
                                        >
                                            <Edit2 size={14} className="text-gray-400 hover:text-pasteleria-rosa" />
                                        </Button>
                                    </div>
                                </AccordionTrigger> */}

                                <div className="flex items-center w-full">
                                    {/* 1. El Trigger ahora solo envuelve la información del paso */}
                                    <AccordionTrigger className="hover:no-underline flex-1 py-4">
                                        <div className="flex items-center gap-4">
                                            <span className="bg-pasteleria-rosa text-white text-xs px-2 py-1 rounded-full">
                                                Paso {attr.step_number}
                                            </span>
                                            <span className="font-bold">{attr.name}</span>
                                            {attr.is_multiple && (
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                                                    Múltiple
                                                </span>
                                            )}
                                        </div>
                                    </AccordionTrigger>

                                    {/* 2. El botón de edición vive FUERA del trigger, pero en la misma línea */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            type="button" // Siempre es bueno ser explícito
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditAttr(attr)}
                                            className="h-8 w-8 p-0 z-10" // El z-10 asegura que el clic sea prioritario
                                        >
                                            <Edit2 size={14} className="text-gray-400 hover:text-pasteleria-rosa" />
                                        </Button>
                                    </div>
                                </div>
                                <AccordionContent>
                                    <div className="py-4">
                                        <div className="flex justify-end mb-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openCreateOption(attr)} // 👈 Usamos la función de limpieza
                                            >
                                                <Plus className="mr-2 size-3" /> Añadir Opción a {attr.name}
                                            </Button>
                                        </div>

                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Imagen</TableHead>
                                                    <TableHead>Nombre</TableHead>
                                                    <TableHead>Precio Extra</TableHead>
                                                    <TableHead className="text-right">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {attr.options.map((opt) => (
                                                    <TableRow key={opt.id}>
                                                        <TableCell>
                                                            {opt.image ? (
                                                                <ImageZoom
                                                                    src={opt.image.includes('demo') ? `/${opt.image}` : `/storage/${opt.image}`}
                                                                    alt={opt.name}
                                                                />
                                                            ) : (
                                                                <div className="size-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                                                                    <ImageIcon size={16} />
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{opt.name}</div>
                                                            <div className="text-xs text-neutral-500">{opt.description}</div>
                                                        </TableCell>
                                                        <TableCell>${Number(opt.additional_price).toLocaleString('es-AR')}</TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={opt.is_active}
                                                                onCheckedChange={() => toggleOptionStatus(opt)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditOption(attr, opt)}
                                                                className="text-blue-500"
                                                            >
                                                                <Edit size={16} />
                                                            </Button>
                                                            {/* <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => deleteOption(opt)} // 👈 Conectamos la función
                                                                className="text-red-500 hover:bg-red-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button> */}

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => confirmDelete(opt)} // 👈 Llamamos a la confirmación estética
                                                                className="text-red-500 hover:bg-red-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </TableCell>
                                                        {/* <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" className="text-red-500">
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </TableCell> */}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Modal para añadir Opciones */}
                    <Dialog open={isOptModalOpen} onOpenChange={(open) => {
                        if (!open) closeOptModal(); // closeOptModal es la función que definimos antes
                        else setIsOptModalOpen(true);
                    }}>
                        <DialogContent>
                            {/* Dejamos el Header siempre presente para la accesibilidad */}
                            <DialogHeader>
                                <DialogTitle>
                                    {editingOption ? `Editar ${editingOption.name}` : `Añadir opción a ${selectedAttribute?.name}`}
                                </DialogTitle>
                            </DialogHeader>

                            {/* Solo el formulario depende del estado */}
                            {selectedAttribute && (
                                <form onSubmit={submitOption} className="space-y-4">
                                    <div>
                                        <Label className='pb-2'>Nombre de la opción</Label>
                                        <Input
                                            value={optForm.data.name}
                                            onChange={e => optForm.setData('name', e.target.value)}
                                            placeholder="Ej: Crema Moka"
                                        />
                                    </div>
                                    <div>
                                        <Label className='pb-2'>Descripción (opcional)</Label>
                                        <Input value={optForm.data.description} onChange={e => optForm.setData('description', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label className='pb-2'>Precio Adicional</Label>
                                        <Input type="number" value={optForm.data.additional_price} onChange={e => optForm.setData('additional_price', e.target.value)} />
                                    </div>
                                    {/* <div>
                                        <Label className='pb-2'>Imagen ilustrativa</Label>
                                        {editingOption && editingOption.image && !optForm.data.image && (
                                            <div className="mb-2">
                                                <ImageZoom src={editingOption.image.includes('demo') ? `/${editingOption.image}` : `/storage/${editingOption.image}`} alt={editingOption.name} />
                                            </div>
                                        )}
                                        <Input type="file" onChange={e => optForm.setData('image', e.target.files[0])} />
                                    </div> */}
                                    <div>
                                        <Label>Imagen ilustrativa</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mb-4"
                                        />

                                        {/* Lógica de Visualización de Imagen */}
                                        <div className="flex items-center gap-4 mt-2">
                                            {/* CASO A: Preview de nueva imagen elegida */}
                                            {previewUrl && (
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-pasteleria-rosa">Nueva imagen:</p>
                                                    <img
                                                        src={previewUrl}
                                                        className="size-24 rounded-lg object-cover border-2 border-pasteleria-rosa shadow-sm"
                                                        alt="Preview"
                                                    />
                                                </div>
                                            )}

                                            {/* CASO B: Imagen actual en DB (solo si está editando y no eligió una nueva) */}
                                            {editingOption?.image && !previewUrl && (
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-neutral-400">Imagen actual:</p>
                                                    {/* <img
                                                        src={`/storage/${editingOption.image}`}
                                                        className="size-24 rounded-lg object-cover border border-neutral-200 grayscale-[0.5]"
                                                        alt="Actual"
                                                    /> */}
                                                    <ImageZoom src={editingOption.image.includes('demo') ? `/${editingOption.image}` : `/storage/${editingOption.image}`} alt={editingOption.name} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={optForm.processing}>
                                        Guardar Opción
                                    </Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>


                    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Estás por eliminar la opción <span className="font-bold text-neutral-900">"{itemToDelete?.name}"</span>.
                                    Esta acción no se puede deshacer y la opción dejará de estar disponible para nuevos pedidos.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={executeDelete}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                    Sí, eliminar opción
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={isAttrModalOpen} onOpenChange={setIsAttrModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingAttribute ? `Editar ${editingAttribute.name}` : 'Crear Grupox de Personalización'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // 1. Verificación de seguridad
                                console.log('Editing Attribute:', editingAttribute);

                                if (!editingAttribute) {
                                    // Modo CREACIÓN
                                    attrForm.post(route('admin.customizations.store'), {
                                        onSuccess: () => {
                                            setIsAttrModalOpen(false);
                                        }
                                    });

                                    return;
                                } else {
                                    // 2. Ejecución del envío
                                    attrForm.put(route('admin.customizations.update', editingAttribute.id), {
                                        onSuccess: () => {
                                            setIsAttrModalOpen(false);
                                            setEditingAttribute(null); // Limpiamos al terminar
                                        },
                                        preserveScroll: true
                                    });
                                }
                            }} className="space-y-4">
                                <div>
                                    <Label className='pb-4'>Nombre del Grupo (ej: Rellenos)</Label>
                                    <Input
                                        value={attrForm.data.name}
                                        onChange={e => attrForm.setData('name', e.target.value)}
                                        className={attrForm.errors.name ? 'border-red-500' : ''}
                                    />
                                    {attrForm.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{attrForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <Label className='pb-4'>Número de Paso</Label>
                                        <Input
                                            type="number"
                                            value={attrForm.data.step_number}
                                            onChange={e => attrForm.setData('step_number', parseInt(e.target.value))}
                                            className={attrForm.errors.step_number ? 'border-red-500' : ''}
                                        />
                                        {attrForm.errors.step_number && (
                                            <p className="text-red-500 text-sm mt-1">{attrForm.errors.step_number}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center  pt-6">
                                        <Switch
                                            checked={attrForm.data.is_multiple}
                                            onCheckedChange={val => attrForm.setData('is_multiple', val)}
                                        />
                                        <Label>¿Permitir varios?</Label>
                                        {attrForm.errors.is_multiple && (
                                            <p className="text-red-500 text-sm">{attrForm.errors.is_multiple}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center  pt-6">
                                        <Switch
                                            checked={attrForm.data.is_required}
                                            onCheckedChange={val => attrForm.setData('is_required', val)}
                                        />
                                        <Label>¿Es obligatorio?</Label>
                                        {attrForm.errors.is_required && (
                                            <p className="text-red-500 text-sm">{attrForm.errors.is_required}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center  pt-6">
                                        <Switch
                                            checked={attrForm.data.is_active}
                                            onCheckedChange={val => attrForm.setData('is_active', val)}
                                        />
                                        <Label>¿Está activo?</Label>
                                        {attrForm.errors.is_active && (
                                            <p className="text-red-500 text-sm">{attrForm.errors.is_active}</p>
                                        )}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-pasteleria-rosa" disabled={attrForm.processing}>
                                    Guardar Cambios
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}