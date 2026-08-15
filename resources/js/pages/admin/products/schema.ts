// resources/js/pages/admin/products/schema.ts
import * as z from "zod";

export const getProductSchema = (isEdit: boolean) => z.object({
    name: z.string().min(3, "El nombre es muy corto"),
    category_id: z.string().min(1, "Seleccioná una categoría"),
    price: z.coerce.number().min(0, "El precio debe ser positivo"),
    // PRECIO: Coerción a número con validación de decimales
    price: z.coerce
        .number({ invalid_type_error: "Ingresá un número válido" })
        .min(0, "El precio no puede ser negativo")
        .step(0.01, "Máximo dos decimales"),
    // ESTADO: Booleano para el Switch/Checkbox
    is_active: z.boolean().default(true),
    description: z.string().optional(),
    image: isEdit
        ? z.any().optional() // En Edit puede ser nulo (mantiene la anterior)
        : z.any().refine((file) => file instanceof File, "La imagen es obligatoria"),
    slug: z.string().min(3, "El slug es muy corto"),
    is_featured: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof getProductSchema>;

