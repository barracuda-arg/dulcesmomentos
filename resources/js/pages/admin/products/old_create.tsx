import { Head, Link } from '@inertiajs/react';

import { zodResolver } from "@hookform/resolvers/zod";

import { router, usePage } from "@inertiajs/react";

import { XCircle } from "lucide-react";

import { useForm } from "react-hook-form";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';


import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { RichTextEditor } from '@/components/rich-text-editor';

import AppLayout from "@/layouts/app-layout";

import { productSchema, type ProductFormValues } from "./schema";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { SectionTitle } from '../section-title';

import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";



const breadcrumbs: BreadcrumbItem[] = [

    {

        module: 'productos',

        title: 'Nuevo Producto',

        href: route('admin.products.index'),

        action: 'create',

        btnAction: 'Cancelar',

    }

];



export default function Create({ categories }) {


    const [imagePreview, setImagePreview] = useState<string | null>(null);


    useEffect(() => {

        return () => {

            if (imagePreview) {

                URL.revokeObjectURL(imagePreview);

            }

        };

    }, [imagePreview]);


    const handleImagePreview = (file: File | undefined) => {

        if (imagePreview) {

            URL.revokeObjectURL(imagePreview);

        }


        if (file) {

            const url = URL.createObjectURL(file);

            setImagePreview(url);

        } else {

            setImagePreview(null);

        }

    };


    const form = useForm<ProductFormValues>({

        resolver: zodResolver(productSchema),

        defaultValues: { name: "", category_id: "", price: 0, description: "" },

    });


    function onSubmit(values: ProductFormValues) {

        router.post(route('admin.products.store'), values, {

            forceFormData: true,


            onSuccess: () => {

                toast.success("¡Éxito!", {

                    description: "La torta se guardó correctamente.",

                })

            },


            onError: (errors) => {

                // Si hay varios errores, los recorremos

                Object.values(errors).forEach((error) => {

                    toast.error("Error al guardar", {

                        description: error,

                    })

                })

            },

        })

    }


    return (

        <AppLayout breadcrumbs={breadcrumbs}>


            <Head title="Algodon" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <Head title="Admin - Productos" />


                <SectionTitle lastBreadcrumb={breadcrumbs[breadcrumbs.length - 1]} />


                <div className="bg-card">

                    <Form {...form}>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


                            <FormField

                                control={form.control}

                                name="name"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Nombre de la Torta</FormLabel>

                                        <FormControl>

                                            <Input placeholder="Ej: Lemon Pie" {...field} className="focus-visible:ring-gray-500/10" />

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />


                            <FormField

                                control={form.control}

                                name="category_id"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Categoría</FormLabel>

                                        <select

                                            {...field}

                                            className="w-full p-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-gray-500/10"

                                        >

                                            <option value="">Seleccionar...</option>

                                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}

                                        </select>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />

                            <FormField

                                control={form.control}

                                name="price"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Precio de Venta ($)</FormLabel>

                                        <FormControl>

                                            <div className="relative">

                                                <span className="absolute left-3 top-2 text-muted-foreground">$</span>

                                                <Input

                                                    type="number"

                                                    step="0.01"

                                                    placeholder="0.00"

                                                    className="pl-7"

                                                    {...field}

                                                />

                                            </div>

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />


                            <FormField

                                control={form.control}

                                name="is_active"

                                render={({ field }) => (

                                    <FormItem className="items-center justify-between rounded-lg border p-4 shadow-xs">

                                        <div className="space-y-0.5">

                                            <div className="group relative inline-block">

                                                <FormLabel className="text-base cursor-help">

                                                    Producto Activo

                                                    <span className="ml-1 text-xs text-gray-400">(?)</span>

                                                </FormLabel>


                                                <div className="tooltip-rosa w-48 text-center">

                                                    Determina si la torta será visible en la tienda.

                                                    <div className="tooltip-arrow"></div>

                                                </div>

                                            </div>

                                        </div>

                                        <FormControl>

                                            <Switch

                                                checked={field.value}

                                                onCheckedChange={field.onChange}

                                                className="data-[state=checked]:bg-pink-600"

                                            />

                                        </FormControl>

                                    </FormItem>

                                )}

                            />

                            <FormField

                                control={form.control}

                                name="image"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Imagen del Producto</FormLabel>


                                        {imagePreview && (

                                            <div className="relative mb-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg border">

                                                <img

                                                    src={imagePreview}

                                                    className="h-full w-full object-cover"

                                                    alt="Preview"

                                                />

                                                <button

                                                    type="button"

                                                    onClick={() => {

                                                        if (imagePreview) {

                                                            URL.revokeObjectURL(imagePreview);

                                                        }


                                                        setImagePreview(null);

                                                        field.onChange(null);

                                                        const input = document.getElementById('input-image') as HTMLInputElement;


                                                        if (input) {

                                                            input.value = '';

                                                        }

                                                    }}

                                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 text-destructive shadow-md hover:bg-destructive hover:text-white transition-all duration-200"

                                                >

                                                    <XCircle className="size-5" />

                                                </button>

                                            </div>

                                        )}



                                        <FormControl>

                                            <Input

                                                type="file"

                                                accept="image/*"

                                                className="cursor-pointer file:bg-pink-100 file:text-pink-700"

                                                onChange={(e) => {

                                                    const file = e.target.files?.[0];

                                                    field.onChange(file);

                                                    handleImagePreview(file);

                                                }}

                                                onBlur={field.onBlur}

                                                name={field.name}

                                                ref={field.ref}

                                                id="input-image"

                                            />

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />

                            <FormField

                                control={form.control}

                                name="description"

                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Descripción Detallada</FormLabel>

                                        <FormControl>

                                            <RichTextEditor

                                                value={field.value || ''}

                                                onChange={field.onChange}

                                            />

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />

                            <FormField

                                control={form.control}

                                name="slug"

                                render={({ field }) => (

                                    <FormItem>

                                        <div className="group relative inline-block">

                                            {/* El Tooltip ahora sí tiene un padre 'group' para reaccionar */}

                                            <div className="tooltip-rosa w-48 text-center">

                                                El slug es la parte de la URL que identifica al producto. Ej: "lemon-pie"

                                                <div className="tooltip-arrow"></div>

                                            </div>

                                            <FormLabel>Slug del Producto sin espacios.<span className="ml-1 text-xs text-gray-400">(?)</span></FormLabel>

                                        </div>

                                        <FormControl>

                                            <Input placeholder="Ej: lemon-pie" {...field} className="focus-visible:ring-gray-500/10" />

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}

                            />

                            <Button

                                type="submit"

                                disabled={form.formState.isSubmitting}

                                className="w-full bg-linear-to-r from-pasteleria-rosa to-pasteleria-rosa text-white font-bold py-6"

                            >

                                {form.formState.isSubmitting ? "Procesando..." : "Guardar Producto"}

                            </Button>

                        </form>

                    </Form>

                </div>

            </div>

        </AppLayout>

    );

}