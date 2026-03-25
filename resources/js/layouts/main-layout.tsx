import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Navbar from '@/components/navbar'; // El componente que unifica Guest y Auth
import Footer from '@/components/footer';

export default function MainLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as any;

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* El Navbar ahora decide internamente qué mostrar según auth.user */}
            <Navbar user={auth.user} />

            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
}