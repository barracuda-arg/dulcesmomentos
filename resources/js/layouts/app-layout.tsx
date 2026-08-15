import { Toaster } from "@/components/ui/sonner"
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps, BreadcrumbItem } from '@/types';

const SectionTitle = ({ lastBreadcrumb }: { lastBreadcrumb: BreadcrumbItem }) => {
    return (
        <div className="px-4 py-6 lg:px-8  bg-pasteleria-rosa-viejo pasteleria-fuente-principal text-lg font-medium">
            {lastBreadcrumb.action}
        </div>
    );
}


// export function Layout({ children }) {
//     return (
//         <main>
//             {children}
//             <Toaster position="top-right" richColors /> {/* richColors permite el verde de éxito y rojo de error */}
//         </main>
//     )
// }

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    // const lastBreadcrumb = breadcrumbs ? breadcrumbs[breadcrumbs.length - 1] : undefined;
    // const showBreadcrumb = lastBreadcrumb && lastBreadcrumb.action;

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            {/* 👈 AGREGALO ACÁ AL FINAL */}
            {/* position: determina dónde sale el cartelito */}
            {/* richColors: hace que el error sea rojo y el éxito verde */}
            <Toaster
                richColors
                toastOptions={{
                    className: 'border-pink-200, bg-pink-100/30', // Un toque sutil para que combine
                }}
                position="top-right"
            />
        </AppLayoutTemplate>
    );
};
