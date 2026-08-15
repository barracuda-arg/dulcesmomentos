export type * from './auth';
export type * from './navigation';
export type * from './ui';
export interface SharedData {
    name: string;
    auth: {
        user: User | null;
        role: string | null;
    };
    sidebarOpen: boolean;
    translations: Record<string, string>;
    site_settings: Record<string, string>;
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: unknown;
}

// Esto le dice a Inertia que use nuestra interfaz enusePage()
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & SharedData;