// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useEffect } from "react";
// import { XCircle } from "lucide-react";
// import { getProductSchema, type ProductFormValues } from "./schema";

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { RichTextEditor } from '@/components/rich-text-editor';
// import { formatPrice } from '@/utils/formatters';

// interface Props {
//     categories: any[];
//     initialData?: ProductFormValues;
//     onSubmit: (values: ProductFormValues) => void;
//     buttonText?: string;
// }

// export function ProductForm({ categories, initialData, onSubmit, isEdit = false, buttonText = "Guardar Producto" }: Props) {



//     const [imagePreview, setImagePreview] = useState<string | null>(null);

//     // Si estamos editando y hay una imagen previa (URL), la mostramos
//     useEffect(() => {
//         if (typeof initialData?.image === 'string') {
//             const imageUrl = initialData.image.includes('demo') ? initialData.image : `/storage/${initialData.image}`;


//             setImagePreview(`${imageUrl}`);
//         }
//     }, [initialData]);

//     const form = useForm<ProductFormValues>({
//         resolver: zodResolver(getProductSchema(!!initialData)),
//         defaultValues: initialData ? {
//             ...initialData,
//             category_id: initialData?.category_id?.toString() || "",
//             // Forzamos booleanos reales
//             is_active: !!initialData.is_active,
//             is_featured: !!initialData.is_featured,
//         } : {
//             name: "",
//             category_id: "",
//             price: "",
//             description: "",
//             is_active: true,
//             is_featured: false,
//             slug: ""
//         },
//     });
//     // Dentro de tu componente Index.tsx
//     const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const name = e.target.value;
//         form.setData(prev => ({
//             ...prev,
//             name: name,
//             slug: name
//                 .toLowerCase()
//                 .trim()
//                 .replace(/[^\w ]+/g, '') // Quita caracteres especiales
//                 .replace(/ +/g, '-')     // Cambia espacios por guiones
//         }));
//     };
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (val: any) => void) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             fieldChange(file);
//             const url = URL.createObjectURL(file);
//             setImagePreview(url);
//         }
//     };

//     useEffect(() => {
//         if (Object.keys(form.formState.errors).length > 0) {
//             console.log("Errores de validación de Zod:", form.formState.errors);
//         }
//     }, [form.formState.errors]);

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 {/* Nombre */}
//                 <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Nombre de la Torta</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     placeholder="Ej: Lemon Pie" {...field}
//                                     onChange={handleNameChange}
//                                     className="focus-visible:ring-gray-500/10"
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 {/* Categoría */}
//                 <FormField
//                     control={form.control}
//                     name="category_id"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Categoría</FormLabel>
//                             <select
//                                 {...field}
//                                 value={field.value?.toString() || ""}
//                                 className="w-full p-2 rounded-md border border-input bg-background text-sm">
//                                 <option value="">Seleccionar...</option>
//                                 {
//                                     categories.map(
//                                         (c) =>
//                                             <option
//                                                 key={c.id}
//                                                 value={c.id.toString()}
//                                             >
//                                                 {c.name}
//                                             </option>
//                                     )
//                                 }
//                             </select>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 {/* Precio */}
//                 <FormField
//                     control={form.control}
//                     name="price"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Precio de Venta ($)</FormLabel>
//                             <FormControl>
//                                 <>
//                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//                                         $
//                                     </span>
//                                     <Input
//                                         type="number"
//                                         step="0.01"
//                                         className="pl-7" // Agregamos padding a la izquierda para que el número no pise al $
//                                         placeholder="0.00"
//                                         {...field}
//                                         // Aseguramos que el valor se maneje como número para evitar problemas con Laravel
//                                         onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
//                                     />
//                                 </>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />



//                 {/* Imagen */}
//                 <FormField
//                     control={form.control}
//                     name="image"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Imagen del Producto</FormLabel>
//                             {imagePreview && (
//                                 <div className="relative mb-4 aspect-video w-full max-w-sm rounded-lg border overflow-hidden">
//                                     <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" />
//                                     <button type="button" onClick={() => { setImagePreview(null); field.onChange(null); }} className="absolute top-2 right-2 p-1 bg-white rounded-full text-destructive"><XCircle /></button>
//                                 </div>
//                             )}
//                             <FormControl>
//                                 <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, field.onChange)} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 {/* Descripción (Tiptap) */}
//                 <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Descripción Detallada</FormLabel>
//                             <FormControl>
//                                 <RichTextEditor value={field.value || ''} onChange={field.onChange} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 {/* Slug */}
//                 <FormField
//                     control={form.control}
//                     name="slug"
//                     render={({ field }) => (
//                         <FormItem>
//                             <div className="group relative inline-block">
//                                 <div className="tooltip-rosa w-48 text-center">
//                                     El slug es la parte de la URL que identifica al producto. Ej: "lemon-pie"
//                                     <div className="tooltip-arrow"></div>
//                                 </div>
//                                 <FormLabel>
//                                     Slug (URL)
//                                     <span className="ml-1 text-xs text-gray-400">(?)</span>
//                                 </FormLabel>
//                             </div>

//                             <FormControl>
//                                 <Input placeholder="ejemplo-de-slug" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 {/* is_featured */}
//                 <FormField
//                     control={form.control}
//                     name="is_featured"
//                     render={({ field }) => (
//                         <FormItem className=" rounded-lg border p-4">
//                             <div className="group relative inline-block">
//                                 <FormLabel>
//                                     Producto Destacado
//                                     <span className="ml-1 text-xs text-gray-400">(?)</span>
//                                 </FormLabel>
//                                 <div className="tooltip-rosa w-48 text-center">
//                                     Determina si el producto aparecerá destacado en la página principal.
//                                     <div className="tooltip-arrow"></div>
//                                 </div>
//                             </div>
//                             <FormControl>
//                                 <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-pink-600" />
//                             </FormControl>
//                         </FormItem>
//                     )}
//                 />
//                 {/* Estado Activo */}
//                 <FormField
//                     control={form.control}
//                     name="is_active"
//                     render={({ field }) => (
//                         <FormItem className=" rounded-lg border p-4">
//                             <div className="group relative inline-block">
//                                 <FormLabel>
//                                     Producto Activo
//                                     <span className="ml-1 text-xs text-gray-400">(?)</span>
//                                 </FormLabel>
//                                 <div className="tooltip-rosa w-48 text-center">
//                                     Determina si la torta será visible en la tienda.
//                                     <div className="tooltip-arrow"></div>
//                                 </div>
//                             </div>
//                             <FormControl>
//                                 <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-pink-600" />
//                             </FormControl>
//                         </FormItem>
//                     )}
//                 />
//                 {/* Es personalizable */}
//                 <FormField
//                     control={form.control}
//                     name="is_customizable"
//                     render={({ field }) => (
//                         <FormItem className=" rounded-lg border p-4">
//                             <div className="group relative inline-block">
//                                 <FormLabel>
//                                     Producto Personalizable
//                                     <span className="ml-1 text-xs text-gray-400">(?)</span>
//                                 </FormLabel>
//                                 <div className="tooltip-rosa w-48 text-center">
//                                     Determina si la torta se puede personalizar agregando o quitando ingredientes.
//                                     <div className="tooltip-arrow"></div>
//                                 </div>
//                             </div>
//                             <FormControl>
//                                 <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-pink-600" />
//                             </FormControl>
//                         </FormItem>
//                     )}
//                 />

//                 <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6">
//                     {form.formState.isSubmitting ? "Procesando..." : buttonText}
//                 </Button>
//             </form>
//         </Form >
//     );
// }

import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from '@/components/rich-text-editor';

interface Props {
    categories: any[];
    initialData?: any;
    buttonText?: string;
    onSubmit: (values: any) => void; // Prop obligatoria para que el padre reciba los datos
}

export function ProductForm({ categories, initialData, buttonText = "Guardar Producto", onSubmit }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // 1. Única fuente de verdad: el hook useForm de Inertia
    const { data, setData, processing, errors } = useForm({
        name: initialData?.name || "",
        category_id: initialData?.category_id?.toString() || "",
        price: initialData?.price || "",
        description: initialData?.description || "",
        is_active: initialData ? !!initialData.is_active : true,
        is_featured: initialData ? !!initialData.is_featured : false,
        is_customizable: initialData ? !!initialData.is_customizable : false,
        slug: initialData?.slug || "",
        image: null as File | null,
    });

    // Efecto para la previsualización de imagen inicial
    useEffect(() => {
        if (typeof initialData?.image === 'string') {
            const imageUrl = initialData.image.includes('demo') ? initialData.image : `/storage/${initialData.image}`;
            setImagePreview(imageUrl);
        }
    }, [initialData]);

    // Generación automática del Slug
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        setData((prev) => ({
            ...prev,
            name: name,
            slug: slug
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    // 2. El handleSubmit ahora solo le pasa el objeto 'data' al padre
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nombre */}
            <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Torta</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={handleNameChange}
                    className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
                <Label htmlFor="category_id">Categoría</Label>
                <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="w-full p-2 rounded-md border border-input bg-background text-sm"
                >
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                </select>
                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
            </div>

            {/* Precio */}
            <div className="space-y-2">
                <Label htmlFor="price">Precio de Venta ($)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                        id="price"
                        type="number"
                        className={`pl-7 ${errors.price ? 'border-destructive' : ''}`}
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                    />
                </div>
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            {/* Imagen */}
            <div className="space-y-2">
                <Label>Imagen del Producto</Label>
                {imagePreview && (
                    <div className="relative mb-4 aspect-video w-full max-w-sm rounded-lg border overflow-hidden">
                        <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" />
                        <button
                            type="button"
                            onClick={() => { setImagePreview(null); setData('image', null); }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full text-destructive shadow-sm"
                        >
                            <XCircle size={20} />
                        </button>
                    </div>
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <Label>Descripción Detallada</Label>
                <RichTextEditor
                    value={data.description}
                    onChange={(val) => setData('description', val)}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                />
            </div>

            {/* Switches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label>Destacado</Label>
                    <Switch
                        checked={data.is_featured}
                        onCheckedChange={(val) => setData('is_featured', val)}
                    />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label>Activo</Label>
                    <Switch
                        checked={data.is_active}
                        onCheckedChange={(val) => setData('is_active', val)}
                    />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label>Personalizable</Label>
                    <Switch
                        checked={data.is_customizable}
                        onCheckedChange={(val) => setData('is_customizable', val)}
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={processing}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6"
            >
                {processing ? "Procesando..." : buttonText}
            </Button>
        </form>
    );
}