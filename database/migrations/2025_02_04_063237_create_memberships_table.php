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
        Schema::create('memberships', function (Blueprint $table) {
            $table->id(); // ID único
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade'); // Relación con clientes
            $table->string('type'); // Tipo de membresía (Ejemplo: mensual, anual)
            $table->date('start_date'); // Fecha de inicio
            $table->date('end_date'); // Fecha de término
            $table->enum('status', ['active', 'expired', 'suspended'])->default('active'); // Estado
            $table->decimal('price', 10, 2); // Precio de la membresía
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
