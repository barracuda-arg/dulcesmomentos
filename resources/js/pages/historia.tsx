import React from 'react';
import { Head } from '@inertiajs/react';
// import PublicLayout from '@/layouts/public-layout'; // Tu layout público con navbar y footer
import MainLayout from '@/layouts/main-layout';
import SectionHeader from './section-header';

interface Props {
    section: {
        title: string;
        description: string | null;
        content: string | null;
        image_url: string | null;
    };
}

export default function About({ section }: Props) {
    return (
        <MainLayout>
            <Head title={`${section.title} - Dulces Momentos`} />

            {/* Cabecera administrada dinámicamente por Eliana */}
            <SectionHeader
                title={section.title}
                description={section.description}
                content={section.content}
                imageUrl={section.image_url}
            />
        </MainLayout>
    );
}