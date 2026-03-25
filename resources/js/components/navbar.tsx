import { Link } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar({ user }: { user: any }) {
    return (
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                {/* LOGO */}
                <Link href="/" className="text-2xl font-bold text-pasteleria-rosa">
                    Dulces Momentos
                </Link>

                {/* MENÚ DERECHO */}
                <div className="flex items-center gap-6">
                    <Link href={route('catalog')} className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">Catálogo</Link>

                    {user ? (
                        /* USUARIO LOGUEADO: Carrito + Avatar */
                        <div className="flex items-center gap-4">
                            <Link href={route('orders')} className="text-sm font-medium hover:text-pasteleria-rosa">Mis Pedidos</Link>
                            <Avatar className="size-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        /* VISITANTE: Botón de Login (Rosa) */
                        <Link
                            href={route('login')}
                            className="rounded-full bg-pasteleria-rosa px-5 py-2 text-sm font-bold text-white transition hover:opacity-90"
                        >
                            Ingresar
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}