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
        Schema::create('order_item_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('custom_option_id')->constrained(); // Referencia a la opción original

            // CAMPOS DE RESPALDO (Snapshot Histórico)
            $table->string('name_at_purchase'); // Guardamos el nombre por si luego cambia
            $table->decimal('price_at_purchase', 12, 2); // 👈 EL PRECIO ELEGIDO EN ESE MOMENTO
            $table->text('description_at_purchase')->nullable(); // Guardamos la descripción por si luego cambia
            $table->string('image_at_purchase')->nullable(); // Guardamos la imagen por si luego cambia

            $table->foreignId('attribute_id_at_purchase')->constrained('custom_attributes')->nullable(); // Referencia al atributo original
            $table->string('attribute_name_at_purchase')->nullable(); // Guardamos el nombre del atributo por si luego cambia
            $table->integer('attribute_step_number_at_purchase')->nullable(); // Guardamos el número de paso del atributo por si luego cambia

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_options');
    }
};
