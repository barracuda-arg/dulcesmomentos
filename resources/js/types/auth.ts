export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type PageSection = {
    id: number;
    slug: string;
    title: string;
};

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
    sections?: PageSection[]; // <-- add this
    [key: string]: unknown;
}

// Esto le dice a Inertia que use nuestra interfaz enusePage()
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & SharedData;