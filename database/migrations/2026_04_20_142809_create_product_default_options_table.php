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

        Schema::create('product_default_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');

            // La opción que viene por defecto
            $table->foreignId('custom_option_id')
                ->constrained('custom_options') // Nombre explícito de tu tabla de opciones
                ->onDelete('cascade')
                ->name('pdo_option_id_foreign'); // Nombre corto para evitar errores de longitud en DB

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_default_options');
    }
};
