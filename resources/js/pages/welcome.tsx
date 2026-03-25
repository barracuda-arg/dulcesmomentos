import MainLayout from '@/layouts/main-layout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <MainLayout>
            <Head title="Inicio" />

            {/* HERO SECTION */}
            <section className="bg-pasteleria-claro py-20 md:py-32">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold text-pasteleria-rosa md:text-7xl">
                        Dulces Momentos
                    </h1>
                    <p className="mt-6 text-xl">
                        Pastelería artesanal en Salta. Hecho en familia, con amor.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link href={route('catalog')} className="rounded-full bg-pasteleria-rosa px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105">
                            Explorar Catálogo
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE CATEGORÍAS (Placeholder) */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-center text-3xl font-bold">Nuestras Especialidades</h2>
                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Aquí irán las Cards de productos más adelante */}
                        <div className="h-40 rounded-xl bg-neutral-100 p-6 shadow-sm flex items-center justify-center italic">
                            Próximamente: Tortas, Postres y más...
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}