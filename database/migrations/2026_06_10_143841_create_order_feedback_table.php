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
        Schema::create('order_feedback', function (Blueprint $table) {
            $table->id();
            // 🌟 CLAVE 1: nullable() va ANTES de constrained() para que MySQL permita nulos en la clave foránea
            $table->foreignId('order_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            // 🌟 CLAVE 2: Nueva columna para guardar el nombre de los clientes de WhatsApp (Manuales)
            $table->string('manual_customer_name')->nullable();


            $table->integer('rating'); // 1 a 5
            $table->text('comment')->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('is_approved')->default(false); // Para que Eliana las modere antes de que salgan en la Home
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_feedback');
    }
};
