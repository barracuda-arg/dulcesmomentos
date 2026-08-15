
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Search, LogOut } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CartButton } from '@/pages/shop/cart-button';

export function AdminLink() {
    return (
        <Link href={route('admin.products.index')} className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">
            Admin
        </Link>
    );
}

export default function Navbar({ user }: { user: any }) {
    // Destructure auth from the shared page props
    const { auth } = usePage().props as any;
    const avatarUrl = typeof user?.avatar === 'string' && user.avatar
        ? (user.avatar.startsWith('http://') || user.avatar.startsWith('https://') || user.avatar.startsWith('data:')
            ? user.avatar
            : `${window.location.origin}/storage/${user.avatar.replace(/^\/+/, '')}`)
        : null;

    return (
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3">
                    {/* Contenedor del Icono */}
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden">
                        <AppLogoIcon className="h-full w-auto fill-current text-pasteleria-rosa" />
                    </div>

                    {/* Texto al lado */}
                    <span className="text-2xl font-bold text-pasteleria-rosa">
                        Dulces Momentos
                    </span>
                </Link>

                {/* MENÚ DERECHO */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        {/* Otros enlaces del menú */}
                        <CartButton />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Otros enlaces del menú */}
                        <Link
                            href={route('order.track.form')}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 hover:text-pink-500 transition-all cursor-pointer"
                        >
                            <Search size={16} />
                            Seguir mi pedido
                        </Link>
                    </div>
                    {auth.role === 'admin' && <AdminLink />}

                    <Link href="/" className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">Inicio</Link>
                    <Link href={route('catalog.index')} className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">Catálogo</Link>
                    <Link href={route('posts.index')} className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">Novedades</Link>
                    <Link href={route('nuestra-historia')} className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">Nuestra Historia</Link>
                    <Link href={route('contacto')} className="text-sm text-subtitulo-berenjena font-medium hover:text-pasteleria-rosa">Contacto</Link>
                    {user ? (
                        /* USUARIO LOGUEADO: Carrito + Avatar */
                        <div className="flex items-center gap-4">
                            {/* <Link href={route('client.dashboard')} className="text-sm font-medium hover:text-pasteleria-rosa">Mi Cuenta</Link> */}
                            <Link
                                href={route('client.dashboard')}
                                title="Mi cuenta"
                                className="inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-pasteleria-rosa/40 focus:ring-offset-2"
                            >
                                <Avatar className="size-8">
                                    <AvatarImage src={avatarUrl || undefined} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                            {/* 🌟 BOTÓN DE CERRAR SESIÓN */}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                title="Cerrar sesión"
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center"
                            >
                                <LogOut size={16} />
                            </Link>
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