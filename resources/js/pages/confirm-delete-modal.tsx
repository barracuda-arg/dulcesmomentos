import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    processing?: boolean;
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "¿Estás seguro de eliminar este registro?",
    description = "Esta acción no se puede deshacer. El registro se eliminará permanentemente de la base de datos.",
    processing = false,
}: ConfirmDeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        disabled={processing}
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-transform active:scale-95"
                    >
                        {processing ? "Eliminando..." : "Sí, eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}