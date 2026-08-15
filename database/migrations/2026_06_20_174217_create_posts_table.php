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
        Schema::create('posts', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique(); // URLs amigables: /novedades/sorteo-dia-del-padre
                $table->text('content'); // Texto largo para recetas o condiciones del sorteo
                $table->string('image_path')->nullable(); // Foto de portada del anuncio o receta
                $table->string('video_path')->nullable(); // Video opcional para recetas o anuncios
                $table->boolean('is_active')->default(true); // Para ocultar/mostrar rápido
                $table->timestamp('published_at')->useCurrent(); // Fecha de publicación
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
