import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";

export const ImageZoom = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!src) return null;

    return (
        <>
            <img
                src={src}
                alt={alt}
                onClick={() => setIsOpen(true)}
                className={className || "size-10 rounded-lg object-cover cursor-zoom-in hover:opacity-80 transition-opacity"}
                width="200px"
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-transparent shadow-nonex">
                    {/* Accesibilidad: Título y descripción ocultos pero presentes */}
                    <VisuallyHidden.Root>
                        <DialogTitle>Vista previa de {alt}</DialogTitle>
                        <DialogDescription>Imagen en tamaño completo</DialogDescription>
                    </VisuallyHidden.Root>

                    <div className="relative flex items-center justify-center">
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-[100vh] rounded-lg shadow-2xl object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};