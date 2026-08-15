<?php

namespace Database\Seeders;

use App\Models\OrderStatus;
use Illuminate\Database\Seeder;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Solicitado', 'color' => '#6B7280'],       // Gris
            ['name' => 'Confirmado (Pago parcial)', 'color' => '#3B82F6'], // Azul
            ['name' => 'En elaboración', 'color' => '#F59E0B'],   // Naranja
            ['name' => 'Listo para Entrega', 'color' => '#355E3B'], // Verde
            ['name' => 'En Distribución', 'color' => '#8B5CF6'],  // Violeta
            ['name' => 'Entregado (Finalizado)', 'color' => '#10B981'], // Negro
            ['name' => 'Cancelado', 'color' => '#EF4444'],        // Rojo (NUEVO)
        ];

        foreach ($statuses as $index => $status) {
            OrderStatus::create([
                'name' => $status['name'],
                'color' => $status['color'],
                'sort_order' => $index + 1, // Para mantener la jerarquía lógica
            ]);
        }
    }
}
