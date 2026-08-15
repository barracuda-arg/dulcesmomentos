// import { Link } from '@inertiajs/react';
// import { ActionButton } from './action-button';
// import { BreadcrumbItem } from '@/types/navigation';

// type SectionTitleProps = {
//     lastBreadcrumb: BreadcrumbItem;
//     actionType?: 'link' | 'modal';
//     onAddItem?: () => void;
// };

// export const SectionTitle = ({
//     lastBreadcrumb,
//     actionType = 'link',
//     onAddItem
// }: SectionTitleProps) => {

//     const showBreadcrumb = lastBreadcrumb && lastBreadcrumb.title;


//     return (
//         <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium">{showBreadcrumb}</h3>
//             <ActionButton
//                 bcItem={lastBreadcrumb}
//                 type={actionType}
//                 onAddItem={onAddItem}
//             />
//         </div>
//     );
// }
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BreadcrumbItem } from '@/types/navigation';
import { ActionButton } from './action-button';

type SectionTitleProps = {
    lastBreadcrumb: BreadcrumbItem;
    actionType?: 'link' | 'modal';
    onAddItem?: () => void;
    dialogContent?: React.ReactNode; // 🌟 NUEVA: Recibe el contenido del Dialog (formulario, etc.)
    dialogOpen?: boolean;            // 🌟 NUEVA: Para controlar el cierre desde afuera
    onDialogOpenChange?: (open: boolean) => void; // 🌟 NUEVA: Sincronizar estado
};

export const SectionTitle = ({
    lastBreadcrumb,
    actionType = 'link',
    onAddItem,
    dialogContent,
    dialogOpen,
    onDialogOpenChange
}: SectionTitleProps) => {

    const breadCrumbTitle = lastBreadcrumb && lastBreadcrumb.title;
    const breadCrumbDescription = lastBreadcrumb && lastBreadcrumb.description;

    // 🌟 Si viene un dialogContent, envolvemos el ActionButton en la lógica de Shadcn
    if (dialogContent) {
        return (
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="text-lg font-medium">{breadCrumbTitle}</h3>
                    {breadCrumbDescription && <div className="text-sm text-gray-500">{breadCrumbDescription}</div>}
                </div>

                <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
                    <DialogTrigger asChild>
                        {/* El ActionButton se convierte en el gatillo del modal automáticamente */}
                        <ActionButton
                            bcItem={lastBreadcrumb}
                            type="modal" // Forzamos a que sea modal
                            onAddItem={onAddItem}
                        />
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white">
                        {dialogContent}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // El flujo común que ya tenías para enlaces u otros tipos de acciones
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <h3 className="text-lg font-medium">{breadCrumbTitle}</h3>
                {breadCrumbDescription && <div className="text-sm text-gray-500">{breadCrumbDescription}</div>}
            </div>
            <ActionButton
                bcItem={lastBreadcrumb}
                type={actionType}
                onAddItem={onAddItem}
            />
        </div>
    );
};


