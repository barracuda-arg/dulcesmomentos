import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner"
import Navbar from '@/components/navbar'; // El componente que unifica Guest y Auth
import Footer from '@/components/footer';

export default function MainLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as any;
    const { sections } = usePage().props as any; // Asegúrate de que 'sections' esté disponible en las props globales
    console.log('Sections in MainLayout:', sections); // Depuración para verificar que las secciones se están pasando correctamente

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* El Navbar ahora decide internamente qué mostrar según auth.user */}
            <Navbar user={auth.user} />

            <main className="flex-grow">
                {children}
            </main>

            <Footer sections={sections} />
            <Toaster
                richColors
                toastOptions={{
                    className: 'border-pink-200, bg-pink-100/30', // Un toque sutil para que combine
                }}
                position="top-right"
            />
        </div>
    );
}