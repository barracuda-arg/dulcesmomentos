import { Link } from '@inertiajs/react';
import { BookOpen, BetweenHorizontalEnd, LayoutGrid, PackageCheck, TruckElectric, Newspaper, Settings } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Productos',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Categorías',
        href: '/admin/categories',
        icon: BookOpen,
    },
    {
        title: 'Accesorios',
        href: '/admin/customizations',
        icon: BetweenHorizontalEnd,
    },
    {
        title: 'Pedidos',
        href: '/admin/orders',
        icon: PackageCheck,
    },
    {
        title: 'Precios de envío',
        href: '/admin/delivery-rates',
        icon: TruckElectric,
    },
    {
        title: 'Momentos Compartidos',
        href: '/admin/feedbacks',
        icon: BookOpen,
    },
    {
        title: 'Novedades',
        href: '/admin/posts',
        icon: Newspaper, // Puedes usar un ícono de "noticias" o "artículo" para esta sección
    },

    {
        title: 'Configuracion de Secciones',
        href: '/admin/configuracion',
        icon: Settings, // Puedes usar un ícono de "noticias" o "artículo" para esta sección
    },

];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
