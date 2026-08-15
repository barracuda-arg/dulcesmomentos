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
        Schema::create('custom_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Rellenos, Bizcochuelos, Toppers...
            $table->string('description')->nullable();
            $table->boolean('is_multiple')->default(false); // ¿Puede elegir varios? (ej: rellenos)
            $table->boolean('is_required')->default(false); // ¿Es obligatorio elegir uno?
            $table->integer('step_number')->default(0); // Número de paso en el proceso de personalización
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_attributes');
    }
};
