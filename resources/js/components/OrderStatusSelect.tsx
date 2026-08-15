import React from 'react';

interface OrderStatusSelectProps {
    orderId: number;
    currentStatusId: number;
    statuses: Array<{ id: number; name: string; color: string }>;
    onStatusChange: (orderId: number, statusId: number) => void;
}

export function OrderStatusSelect({
    orderId,
    currentStatusId,
    statuses,
    onStatusChange,
}: OrderStatusSelectProps) {
    const currentStatus = statuses.find((s) => s.id === currentStatusId);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStatusChange(orderId, parseInt(e.target.value));
    };

    return (
        <div className="relative">
            <select
                value={currentStatusId}
                onChange={handleChange}
                className="appearance-none w-full h-12 text-xs rounded-full px-8 py-1.5 font-bold text-white border-none cursor-pointer shadow-sm focus:outline-none"
                style={{ backgroundColor: currentStatus?.color }}
            >
                {statuses.map((s) => (
                    <option key={s.id} value={s.id} className="text-gray-900 bg-white italic">
                        {s.name}
                    </option>
                ))}
            </select>
            {/* Custom Arrow centered vertically */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="h-4 w-4 fill-current mx-2" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
}
