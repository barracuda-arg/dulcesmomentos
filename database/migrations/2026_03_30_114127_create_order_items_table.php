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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained();
            $table->string('product_name'); // Guardamos el nombre del producto al momento de la compra
            $table->string('product_image_at_purchase')->nullable(); // Guardamos el nombre del producto al momento de la compra
            $table->string('additional_info')->nullable(); // Guardamos las opciones seleccionadas (si es customizable)
            $table->json('selections')->comment('Contiene el objeto de opciones seleccionadas');
            $table->integer('quantity')->default(1);
            $table->decimal('price_at_purchase', 12, 2); // Guardamos el precio del momento por si luego cambia el producto
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
