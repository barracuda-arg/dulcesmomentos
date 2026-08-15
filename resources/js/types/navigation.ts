import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    module: string | null;
    title: string;
    description?: string | null;
    href: NonNullable<InertiaLinkProps['href']>;
    action: string | null;
    btnAction: string | null;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
