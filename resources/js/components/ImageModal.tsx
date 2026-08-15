import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ImageZoom } from '@/pages/zoom';

interface ImageTooltipProps {
    trigger: React.ReactNode;
    imageSrc: string;
    imageAlt: string;
    size?: 'sm' | 'md' | 'lg';
}

export function ImageModal({
    trigger,
    imageSrc,
    imageAlt,
    size = 'md',
}: ImageTooltipProps) {
    const sizeClasses = {
        sm: 'w-64 h-64',
        md: 'w-96 h-96',
        lg: 'w-[28rem] h-[28rem]',
    };

    return (
        <Tooltip.Provider>
            <Tooltip.Root delayDuration={200}>
                <Tooltip.Trigger asChild>
                    {trigger}
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content
                        className={`rounded-3xl overflow-hidden bg-gray-100 shadow-2xl border border-gray-200 z-[9999] ${sizeClasses[size]}`}
                        sideOffset={5}
                    >
                        {/* <ImageZoom
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full h-full object-cover"
                        /> */}
                        < img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
                        <Tooltip.Arrow className="fill-gray-200" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
