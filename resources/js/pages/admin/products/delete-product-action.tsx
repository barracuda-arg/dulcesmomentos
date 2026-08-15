
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
    productId: number;
    productName: string;
}

export function DeleteProductAction({ productId, productName }: Props) {
    const onDelete = () => {
        router.delete(route('admin.products.destroy', productId), {
            onSuccess: () => toast.success("Producto eliminado correctamente"),
            onError: () => toast.error("No se pudo eliminar el producto"),
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive border-red-600/40 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    asChild
                >
                    <span className="flex items-center">
                        <Trash2 className="mr-2" />
                        Eliminar
                    </span>
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará la torta <strong>{productName}</strong> y su imagen de forma permanente. No podrás deshacer esto.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    {/* Le damos un estilo rojo al botón de acción para indicar peligro */}
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        Eliminar Producto
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}