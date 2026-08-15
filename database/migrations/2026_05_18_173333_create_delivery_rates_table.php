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
        Schema::create('delivery_rates', function (Blueprint $table) {
            $table->id();
            // Usamos unsignedDecimal para permitir tramos cortos como "1.5" km
            $table->decimal('max_distance_km', 5, 2)->unsigned()->unique();
            $table->decimal('price', 8, 2)->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_rates');
    }
};
