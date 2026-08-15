<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_token')->unique(); // El ID público alfanumérico
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('order_status_id')->constrained();

            // Datos del Cliente (para el que compra sin loguearse)
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone');

            // Logística
            $table->boolean('is_delivery')->default(false);
            $table->text('delivery_address'); // Dirección de entrega en Salta
            $table->text('delivery_lat')->nullable();
            $table->text('delivery_lng')->nullable();
            $table->string('delivery_distance')->nullable();
            $table->decimal('delivery_cost', 12, 2);
            $table->datetime('delivery_date')->nullable();

            $table->text('notes')->nullable(); // Observaciones del pedido

            // Totales
            $table->decimal('items_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);
            $table->string('motivo_cancelacion')->nullable(); // Motivo de cancelación
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
